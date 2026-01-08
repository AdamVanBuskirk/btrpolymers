//import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { getUser } from '../helpers/getUser';
import { IStripePlan } from '../models/domain/StripePlan';
import { IStripePayment } from '../models/domain/StripePayment';
import { dtoStripePlan } from '../models/dto/dtoStripePlan';
import { addDays, startOfDay } from 'date-fns';
import Stripe from 'stripe';
import { ICompanyUser } from '../models/domain/CompanyUser';
import { ICompany } from '../models/domain/Company';
import { IRole } from '../models/domain/Role';
import { IUserRole } from '../models/domain/UserRole';
import { IUser } from '../models/domain/User';
import { getRoleName } from '../helpers/getRoleName';

const fns = require('date-fns');
const StripePlan = require('../models/domain/StripePlan');
const Company = require('../models/domain/Company');
const CompanyUser = require('../models/domain/CompanyUser');
const Role = require('../models/domain/Role');
const UserRole = require('../models/domain/UserRole');
const User = require('../models/domain/User');
const StripePayment = require('../models/domain/StripePayment');
const activityController = require('../controllers/ActivityController');
const MailController = require('../controllers/MailController');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil' as any,
});

interface ExpandedInvoice extends Stripe.Invoice {
    payment_intent?: string | Stripe.PaymentIntent;
}

const getSubscriptionItemId = async (subscriptionId: string) => {

    // Retrieve the subscription object from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Make sure the subscription has at least one item
    if (!subscription.items?.data?.length) {
        throw new Error(`No subscription items found for ${subscriptionId}`);
    }

    // Extract the first item’s ID
    const subscriptionItemId = subscription.items.data[0].id;
    return subscriptionItemId;
}

const adjustSubscription = async (companyId: string) => {

    const ownerRole: IRole = await Role.findOne({ name: "owner" });
    if (!ownerRole) return;

    const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
    if (!userRole) return;

    const owner: IUser = await User.findOne({ _id: userRole.userId });
    if (!owner) return;

    const lastPayment: IStripePayment = await StripePayment.findOne(
        { userId: owner._id, active: true }
    ).sort({ created: -1 }); // sort newest first by `created` field
      
    if (!lastPayment) return;

    let licensedUsers: ICompanyUser[] = await CompanyUser.find({ companyId, active: true });

    await stripe.subscriptions.update(lastPayment.subscriptionId, {
        items: [{
            id: await getSubscriptionItemId(lastPayment.subscriptionId),
            quantity: licensedUsers.length, // total active users, not delta
        }],
        proration_behavior: 'always_invoice',
    });
}

const getPlans = async (req: Request, res: Response) => {
    try {
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        let plans: Array<dtoStripePlan> = [];
        const products = await StripePlan.find();
        products.map((plan: IStripePlan) => {
            plans.push({
                _id: plan._id.toString(), 
                productId: plan.productId,
                priceId: plan.priceId,
                name: plan.name,
                description: plan.description,
                features: plan.features,
                price: plan.price,
                billingCycle: plan.billingCycle,
                sort: plan.sort,
            })
        });
        return res.status(200).json(plans);
    } catch (err: any) {
        res.status(500).json({ 'message': err.message });
    }
}

const createSubscription = async (req: Request, res: Response) => {

    const { companyId, priceId, qty } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    /* valid payload */
    if (!companyId || !priceId || !qty) return res.status(403).json({ 'message': 'Invalid payload.' });

    try {

        const foundUser = await getUser(req.cookies, "company", companyId);
        if (!foundUser) return res.status(403).json({ 'message': 'User not found.' });

        const company: ICompany = await Company.findOne({ _id: companyId });
        if (!company) return res.status(403).json({ 'message': 'Invalid company.' });

        let role = await getRoleName(company._id, foundUser._id);
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });

        /* get the email of the company's owner, as it will be the customer email, 
        regardlesss of whether they or a billing admin make the purchase. */

        const ownerRole: IRole = await Role.findOne({ name: "owner" });
        if (!ownerRole) return res.status(403).json({ 'message': 'Invalid role.' });

        const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
        if (!userRole) return res.status(403).json({ 'message': 'Invalid user role.' });

        const owner: IUser = await User.findOne({ _id: userRole.userId });
        if (!owner) return res.status(403).json({ 'message': 'Invalid company owner.' });

        const plan: IStripePlan = await StripePlan.findOne({ priceId: priceId });
        if (plan)  {

            const customers = await stripe.customers.list({ email: owner.email });
            let customer = customers.data[0];

            if (!customer) {
                customer = await stripe.customers.create({
                    name: company.name,
                    email: owner.email
                });
            }

            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: priceId, quantity: qty }],
                proration_behavior: 'create_prorations', /* for mid cycle add and remove licenses */
                payment_behavior: 'default_incomplete',
                collection_method: 'charge_automatically',
                payment_settings: {
                  payment_method_types: ['card'],
                  save_default_payment_method: 'on_subscription',
                },
                expand: [
                  'latest_invoice.payment_intent',
                  'latest_invoice.confirmation_secret', // keep this for forward compat
                ],
            });
              
              
            const invoice = subscription.latest_invoice as Stripe.Invoice & {
                payment_intent?: Stripe.PaymentIntent | string;
                confirmation_secret?: { client_secret?: string };
            };
              
              // Prefer the real payment intent client_secret
              let clientSecret: string | undefined;
              if (invoice.payment_intent && typeof invoice.payment_intent !== 'string') {
                clientSecret = invoice.payment_intent.client_secret!;
              } else if (invoice.confirmation_secret?.client_secret) {
                clientSecret = invoice.confirmation_secret.client_secret;
              }

            const payment = await StripePayment.create({
                userId: foundUser._id,
                stripePlanId: plan._id,
                customerId: customer.id,
                subscriptionId: subscription.id,
                invoiceId: invoice.id,
                payment: now,
                created: now,
                modified: now,
                status: "succeeded",
                active: true
            });

            activityController.register({
                userId: foundUser._id,
                section: "billing",
                object: "user",
                objectId: foundUser._id,
                action: "subscribe",
                description: `${foundUser.firstName} ${foundUser.lastName} for company ${company.name} subscribed.`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });

            //console.log("Resolved clientSecret:", clientSecret, "PaymentIntent:", invoice.payment_intent);
            res.send({ payment: payment, clientSecret: clientSecret });
        } else {
            res.status(400).send({ error: { message: "Price Plan Not Found"} });
        }

    } catch (err: any) {
        //console.error(err);
        res.status(400).send({ error: { message: err.message } });
    }
  }

const getMostRecentPayment = async (req: Request, res: Response) => {

    const { companyId } = req.params;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    if (!companyId) return res.status(403).json({ 'message': 'Invalid payload.' });

    try {

        const foundUser = await getUser(req.cookies, "company", companyId);
        if (!foundUser) return res.status(403).json({ 'message': 'User not found.' });

        const company: ICompany = await Company.findOne({ _id: companyId });
        if (!company) return res.status(403).json({ 'message': 'Invalid company.' });

        let role = await getRoleName(company._id, foundUser._id);
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });

        /* get the email of the company's owner, as it will be the customer email, 
        regardlesss of whether they or a billing admin make the purchase. */

        const ownerRole: IRole = await Role.findOne({ name: "owner" });
        if (!ownerRole) return res.status(403).json({ 'message': 'Invalid role.' });

        const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
        if (!userRole) return res.status(403).json({ 'message': 'Invalid user role.' });

        const owner: IUser = await User.findOne({ _id: userRole.userId });
        if (!owner) return res.status(403).json({ 'message': 'Invalid company owner.' });

        /* If the user has started a subscription, they will have at least one record in the 
            the StripePayments table, so we get the subscriptionId from it. If none found, we
            know there are no payments, past or new, to pull because no subscription exists.
         */
        let stripePaymentsToInsert: Array<any> = [];
        let today = new Date();
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        let lastPayment: IStripePayment = await StripePayment.findOne({ userId: foundUser._id }).sort({ payment: -1 });

        if (lastPayment) {

            let daysLeft = Math.ceil((addDays(new Date(lastPayment.payment), 30).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            //console.log("Days Left: " + daysLeft);
            //if (daysLeft <= 30) {
            if (daysLeft <= 0) {
                /* Check stripe for a new invoice. If we find one, update our payments table so we know of 
                   the payment and send the latest payment to the frontend. */

                /* replaced with below to also include failed payments
                const invoices = await stripe.invoices.list({
                    subscription: lastPayment.subscriptionId,
                    status: 'paid',
                    limit: 12, // Grab 1 years worth in case they've been paying, but not logging in
                });
                */

                /* Check stripe for new invoices (paid or failed). */
                const [paidInvoices, failedInvoices, openInvoices] = await Promise.all([
                    stripe.invoices.list({
                        subscription: lastPayment.subscriptionId,
                        status: "paid",
                        limit: 12,
                    }),
                        stripe.invoices.list({
                        subscription: lastPayment.subscriptionId,
                        status: "uncollectible", // permanently failed
                        limit: 12,
                    }),
                        stripe.invoices.list({
                        subscription: lastPayment.subscriptionId,
                        status: "open", // include retrying invoices
                        limit: 12,
                    }),
                ]);

                // Include "open" invoices that have failed attempts (not paid)
                const filteredOpenFailed = openInvoices.data.filter(
                    (inv) => inv.status === "open" && inv.attempt_count! > 0
                );

                // Combine and sort invoices
                const allInvoices = [
                    ...paidInvoices.data,
                    ...failedInvoices.data,
                    ...filteredOpenFailed,
                ].sort((a, b) => b.created - a.created);


                for (const invoice of allInvoices) {
                    const alreadyExists = await StripePayment.findOne({
                        invoiceId: invoice.id,
                    });
                    if (alreadyExists) continue;
            
                    const isPaid = invoice.status === "paid";
                    //const isFailed = invoice.status === "uncollectible" || invoice.status === "open";
            
                    const doc = {
                        userId: owner._id,
                        invoiceId: invoice.id,
                        stripePlanId: lastPayment.stripePlanId,
                        customerId: lastPayment.customerId,
                        subscriptionId: lastPayment.subscriptionId,
                        payment: now,
                        status: isPaid ? "succeeded" : "failed",
                        active: isPaid, // false if failed
                        created: now,
                        modified: now,
                    };
            
                    stripePaymentsToInsert.push({ insertOne: { document: doc } });
                }
            
                if (stripePaymentsToInsert.length > 0) {
                    await StripePayment.bulkWrite(stripePaymentsToInsert);
                    lastPayment = await StripePayment.findOne({
                        userId: owner._id,
                    }).sort({ payment: -1 });
                }              
            }
        }

        res.status(200).json(lastPayment);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    
}


const deleteMostRecentPayment = async (req: Request, res: Response) => {

    const { companyId, _id } = req.params;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    
    try {

        const foundUser = await getUser(req.cookies, "company", companyId);
        if (!foundUser) return res.status(403).json({ 'message': 'User not found.' });

        let role = await getRoleName(companyId, foundUser._id);
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });
/*
        const company: ICompany = await Company.findOne({ _id: companyId });
        if (!company) return res.status(403).json({ 'message': 'Invalid company.' });

        const ownerRole: IRole = await Role.findOne({ name: "owner" });
        if (!ownerRole) return res.status(403).json({ 'message': 'Invalid role.' });

        const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
        if (!userRole) return res.status(403).json({ 'message': 'Invalid user role.' });

        const owner: IUser = await User.findOne({ _id: userRole.userId });
        if (!owner) return res.status(403).json({ 'message': 'Invalid company owner.' });
*/
        await StripePayment.deleteOne({ _id: _id });
        res.sendStatus(200);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

const cancelSubscription = async (req: Request, res: Response) => {

    const { companyId, subscriptionId } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    
    try {

        const foundUser = await getUser(req.cookies, "company", companyId);
        if (!foundUser) return res.status(403).json({ 'message': 'User not found.' });

        const company: ICompany = await Company.findOne({ _id: companyId });
        if (!company) return res.status(403).json({ 'message': 'Invalid company.' });

        let role = await getRoleName(company._id, foundUser._id);
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });

        /* get the email of the company's owner, as it will be the customer email, 
        regardlesss of whether they or a billing admin make the purchase. */

        const ownerRole: IRole = await Role.findOne({ name: "owner" });
        if (!ownerRole) return res.status(403).json({ 'message': 'Invalid role.' });

        const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
        if (!userRole) return res.status(403).json({ 'message': 'Invalid user role.' });

        const owner: IUser = await User.findOne({ _id: userRole.userId });
        if (!owner) return res.status(403).json({ 'message': 'Invalid company owner.' });

        // End of period (most common):
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        /* When a user cancels their subscriptions, we update the most recent payment to active: false. This simply
        is our way of knowing they cancelled. */

        const payment = await StripePayment.findOne({ userId: foundUser._id, subscriptionId: subscriptionId }).sort({ payment: -1 });

        if (!payment) {
            return res.status(404).json({ message: 'No payment record found.' });
        }
        
        payment.active = false;
        payment.modified
        await payment.save();

        activityController.register({
            userId: foundUser._id,
            section: "billing",
            object: "user",
            objectId: foundUser._id,
            action: "cancel",
            description: `${foundUser.firstName} ${foundUser.lastName} cancelled their subscription to the Pro Plan.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        res.status(200).json(payment);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}


  /* used to update the credit card on file */
  const createSetupIntent = async (req: Request, res: Response) => {

    const { companyId } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    const foundUser = await getUser(req.cookies, "company", companyId);
    if (!foundUser) return res.status(403).json({ 'message': 'User not found.' });

    const company: ICompany = await Company.findOne({ _id: companyId });
    if (!company) return res.status(403).json({ 'message': 'Invalid company.' });

    let role = await getRoleName(company._id, foundUser._id);
    if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });

    /* get the email of the company's owner, as it will be the customer email, 
    regardlesss of whether they or a billing admin make the purchase. */

    const ownerRole: IRole = await Role.findOne({ name: "owner" });
    if (!ownerRole) return res.status(403).json({ 'message': 'Invalid role.' });

    const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
    if (!userRole) return res.status(403).json({ 'message': 'Invalid user role.' });

    const owner: IUser = await User.findOne({ _id: userRole.userId });
    if (!owner) return res.status(403).json({ 'message': 'Invalid company owner.' });

    const customers = await stripe.customers.list({ email: owner.email });
    let customer = customers.data[0];
  
    if (!customer) {
      customer = await stripe.customers.create({ email: owner.email });
    }
  
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
    });
  
    res.json({ clientSecret: setupIntent.client_secret });
  };

const setDefaultPayment = async (req: Request, res: Response) => {

    try {
        const { companyId, customerId, subscriptionId, paymentMethodId } = req.body;
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    
        const foundUser = await getUser(req.cookies, "company", companyId);
        if (!foundUser) return res.status(403).json({ 'message': 'User not found.' });
    
        const company: ICompany = await Company.findOne({ _id: companyId });
        if (!company) return res.status(403).json({ 'message': 'Invalid company.' });

        let role = await getRoleName(company._id, foundUser._id);
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });
    
        /* get the email of the company's owner, as it will be the customer email, 
        regardlesss of whether they or a billing admin make the purchase. */
    
        const ownerRole: IRole = await Role.findOne({ name: "owner" });
        if (!ownerRole) return res.status(403).json({ 'message': 'Invalid role.' });
    
        const userRole: IUserRole = await UserRole.findOne({ roleId: ownerRole._id, companyId: companyId });
        if (!userRole) return res.status(403).json({ 'message': 'Invalid user role.' });
    
        const owner: IUser = await User.findOne({ _id: userRole.userId });
        if (!owner) return res.status(403).json({ 'message': 'Invalid company owner.' });

        if (!customerId || !paymentMethodId) {
            return res.status(400).json({ message: 'Missing customerId or paymentMethodId' });
        }
  
        // Set as default payment method for invoices
        await stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        // Also set it for the subscription (if provided)
        if (subscriptionId) {
            await stripe.subscriptions.update(subscriptionId, {
                default_payment_method: paymentMethodId,
            });
        }
  
        res.json({ success: true });
    
    } catch (err: any) {
        console.error('Error setting default payment method:', err);
        res.status(500).json({ message: err.message });
    }
};


const checkExpiringCards = async () => {
  
    // We need to connect to Mongo here since Express may not be loaded when running this direct via Node
    // (Heroku schedule job or terminal)
    const connectDB = require("../config/dbConn");
    connectDB(); // connect to MongoDB
    /* Get active customrs */

    const activeCustomerIds: IStripePayment[] = await StripePayment.find(
        { status: "active" },
        { customerId: 1, _id: 0 }
    ).lean();
      
    // Deduplicate
    const customerIds = [...new Set(activeCustomerIds.map(p => p.customerId))];

    //console.log(`Found ${customerIds.length} active customers`);

    for (const customerId of customerIds) {
        try {

            const customer = await stripe.customers.retrieve(customerId);

            // Type guard: make sure it's not a DeletedCustomer
            if (customer.deleted) {
                console.warn(`Customer ${customerId} is deleted, skipping.`);
                continue;
            }

            if (!customer || typeof customer.email !== "string") continue;
      
            const email = customer.email;
            const name = typeof customer.name === "string" ? customer.name : "Customer";
      
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customerId,
                type: "card",
            });
        
            for (const pm of paymentMethods.data) {

                const { exp_month, exp_year, last4 } = pm.card!;
                const expDate = new Date(exp_year, exp_month - 1, 1);
                const daysUntilExpire = (expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            
                if (daysUntilExpire <= 30 && daysUntilExpire > 0) {

                    console.log(
                        `⚠️  Customer ${customerId} has card ending ${last4} expiring in ${Math.round(
                            daysUntilExpire
                        )} days`
                    );
                    
                    // Send email to the user
                    MailController.send({
                        to: email,
                        from: "support@salesdoing.com",
                        subject: "Your SalesDoing payment method is about to expire",
                        text: `
                            Hi ${name},\n
                            Your saved payment card ending in ${last4} will expire on ${exp_month}/${exp_year}.\n
                            Please login to SalesDoing, click your avatar located top-right, and then select the Billing tab to update your card and avoid any service interruption.\n
                            - The SalesDoing Team\n
                        `,
                        html:  `
                            <p>Hi ${name},</p>
                            <p>Your saved payment card ending in <b>${last4}</b> will expire on <b>${exp_month}/${exp_year}</b>.</p>
                            <p>Please login to SalesDoing, click your avatar located top-right, and then select the Billing tab to update your card and avoid any service interruption.</p>
                            <p>- The SalesDoing Team</p>
                        `
                    });
                }
            }

        } catch (err) {
            console.error(`Error processing customer ${customerId}:`, err);
        }
    }
    console.log("✅ Card check complete");
    process.exit(0);
}

const getPaymentInfo = async (req: Request, res: Response) => {

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object as any;

    try {
        switch (event.type) {
        case "invoice.payment_failed":
            /* Update the last payment as inactive (this payment would be the most recent successful payment).
               The way it works is, if we get a failed payment here, it marks the most recent payment as inactive. This
               is because we don't store a subscription record, rather we use the active status on the most recent
               payment. So, now we have an inactive sub. Now, if the user makes a payment, our getMostRecentPayment function
               in this same controller will pick it up from Stripe, the newest payment will be active: true, and the 
               sub is back active again. Stripe will automatically keep trying to charge the card, so it handles the 
               re-attempts.
            */
            const payment = await StripePayment.findOneAndUpdate(
                { subscriptionId: data.subscription },
                { active: false },
                { new: true }
              ).sort({ payment: -1 });
            break;
        /* The below have never been used / are not needed - we handle other ways 
        case "invoice.payment_succeeded":
            await updatePaymentStatus(data.subscription, "succeeded");
            break;

        case "customer.subscription.updated":
            await updatePaymentStatus(data.id, data.status);
            break;

        case "customer.subscription.deleted":
            await updatePaymentStatus(data.id, "canceled");
            break;
        */
        default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });

    } catch (err) {
      console.error("Webhook handler error:", err);
      res.status(500).send("Webhook handler failed");
    }

} // end
  
module.exports = {
    getMostRecentPayment,
    deleteMostRecentPayment,
    getPlans,
    //createPlans,
    createSubscription,
    cancelSubscription,
    createSetupIntent,
    setDefaultPayment,
    adjustSubscription,
    checkExpiringCards,
    //getPaymentInfo
};