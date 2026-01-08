
const User = require("../models/domain/User");
const Setting = require("../models/domain/Setting");

//import { IUserToChannel } from '../models/domain/UserToChannel';
const sgMail = require('@sendgrid/mail');


import * as fns from "date-fns";
import { addDays } from "date-fns";

const Company = require("../models/domain/Company");
const Role = require("../models/domain/Role");
const UserRole = require("../models/domain/UserRole");

const StripePayment = require("../models/domain/StripePayment");

interface Email {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
}
/*
interface EmailReportArgs {
    to: string[];
    subject: string;
    html: string;
    pdfBuffer?: Buffer;
};
*/
type EmailReportArgs = {
    to: string[];             
    subject: string;
    html: string;
    companyId: string;  
    pdfBuffer?: Buffer;
    csvBuffer?: Buffer;
    csvFilename?: string;  
  };

const sendActivationEmail = async (to: string, activationToken: string) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    let subject = "Activate Your herdr Account";
    let html = `
    <p>Please click the below link to activate your <strong>herdr</strong> account and login.</p>
    <p style='padding-top:10px;'>
        <a href='${process.env.SITE_DOMAIN}/login?ac=${activationToken}'>
            Activate Your Account
        </a>
    </p>
    `;

    const message: Email = {
        to: to,
        from: "support@herdr.io",
        subject: subject,
        text: "no text version",
        html: html
    }

    send(message);
}

const sendRecoveryEmail = async (to: string, passwordRecoveryToken: string) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    let subject = "Recovery link for your herdr account";
    let html = `
    <p>
        Please click the below link to visit <strong>herdr</strong> and reset your password. If
        you didn't initiate this email, please disregard.
    </p>
    <p style='padding-top:10px;'>
        <a href='${process.env.SITE_DOMAIN}/recover?ar=${passwordRecoveryToken}'>
            Recover your account
        </a>
    </p>
    `;

    const message: Email = {
        to: to,
        from: "support@herdr.io",
        subject: subject,
        text: "no text version",
        html: html
    }

    send(message);
}

const sendInvitedUserEmail = async (
    to: string,
    shareLink: string,
    firstName: string,
    lastName: string,
) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    let subject = `You've been invited to join SalesDoing 🔥`;
    let html = `
    <p style='width:400px;padding-top:10px;'>
        <b>${firstName} ${lastName}</b> has invited you to join their company's SalesDoing platform - 
        a space to log sales activity, collaborate, and grow your business together.
    </p>
    <p style='padding-top:10px;padding-bottom:10px;'>
        <a style='display: inline-block;
        background-color: #ffffff;
        color: #ea580c;
        text-decoration: none;
        border: 1px solid #ea580c;
        border-radius: 30px;
        padding: 6px 14px;
        font-weight: 450;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 16px;
        letter-spacing: 0.3px;'
            href='${process.env.SITE_DOMAIN}/${shareLink}'>
            Step Into SalesDoing
        </a>
    </p>
    `;

    let text = `
        ${firstName} ${lastName} has invited you to join their company's SalesDoing platform - 
        a space to log sales activity, collaborate, and grow your business together.\n\n
        Step Into SalesDoing: ${process.env.SITE_DOMAIN}/${shareLink}\n\n
    `;

    const message: Email = {
        to: to,
        from: "support@salesdoing.com",
        subject: subject,
        text: text,
        html: html
    }

    send(message);
}

const send = (message: Email) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail
    .send(message)
    .then((res: any) => {
    })
    .catch((error: any) => {
        console.error(error)
    });
}
  /*
export async function emailReport({
    to,
    subject,
    html,
    companyId,
    pdfBuffer,
    csvBuffer,
    csvFilename,
  }: EmailReportArgs) {

    const attachments: any[] = [];
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // ✅ keep your existing PDF attachment behavior
    if (pdfBuffer) {
      attachments.push({
        content: pdfBuffer.toString("base64"),
        filename: "report.pdf",
        type: "application/pdf",
        disposition: "attachment",
      });
    }
  
    // ✅ add CSV attachment behavior
    if (csvBuffer) {
      attachments.push({
        content: csvBuffer.toString("base64"),
        filename: csvFilename || "report.csv",
        type: "text/csv",
        disposition: "attachment",
      });
    }
  
    const msg: any = {
      to,                 // keep your existing structure (array vs comma string)
      from: "reports@salesdoing.com",
      subject,
      html,
      ...(attachments.length ? { attachments } : {}),
    };
    //console.log("made it to send");
    //return sgMail.send(msg);
   
    return await sgMail.send(msg);
  }
  */

  export async function emailReport({
    companyId,
    to,
    subject,
    html,
    pdfBuffer,
    csvBuffer,
    csvFilename,
  }: EmailReportArgs) {
    // ✅ block if account is expired
    const expired = await isCompanyExpired(companyId);
    if (expired) {
      console.log("[emailReport] BLOCKED (company expired)", { companyId, to });
      return;
    }
  
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  
    const attachments: any[] = [];
  
    if (pdfBuffer) {
      attachments.push({
        content: pdfBuffer.toString("base64"),
        filename: "report.pdf",
        type: "application/pdf",
        disposition: "attachment",
      });
    }
  
    if (csvBuffer) {
      attachments.push({
        content: csvBuffer.toString("base64"),
        filename: csvFilename || "report.csv",
        type: "text/csv",
        disposition: "attachment",
      });
    }
  
    const msg: any = {
      to,
      from: "reports@salesdoing.com",
      subject,
      html,
    };
  
    if (attachments.length) msg.attachments = attachments;
  
    return sgMail.sendMultiple(msg);
  }
  
  async function isCompanyExpired(companyId: string): Promise<boolean> {
    if (!companyId) return false; // fail-open (don’t block if we can't evaluate)
  
    // confirm company exists (optional but safe)
    const company = await Company.findOne({ _id: companyId }).select("_id").lean();
    if (!company) return false;
  
    // find owner user for the company (same pattern you use elsewhere) :contentReference[oaicite:1]{index=1}
    const ownerRole = await Role.findOne({ name: "owner" }).lean();
    if (!ownerRole) return false;
  
    const ownerUserRole = await UserRole.findOne({
      roleId: ownerRole._id,
      companyId: companyId,
    }).lean();
  
    if (!ownerUserRole?.userId) return false;
  
    const owner = await User.findOne({ _id: ownerUserRole.userId }).lean();
    if (!owner) return false;
  
    // early adopters never expire (per your rule)
    if (owner.earlyAdopter === true) return false;
  
    // determine owner created date (your schema might be `created` string or `createdAt` Date)
    const created =
      owner.createdAt ||
      (owner.created ? new Date(owner.created) : null);
  
    if (!created || isNaN(new Date(created).getTime())) {
      return false; // fail-open if we can't interpret the date
    }
  
    const daysSinceCreated = fns.differenceInDays(new Date(), new Date(created));
  
    // not older than 30 days => not expired
    if (daysSinceCreated <= 30) return false;
  
    // recent payment check (same "30 days from lastPayment.payment" idea) :contentReference[oaicite:2]{index=2}
    // NOTE: We only consider succeeded/active payments as "recent payment"
    const lastPayment = await StripePayment.findOne({
      userId: owner._id,
      active: true,
      status: "succeeded",
    })
      .sort({ payment: -1 })
      .lean();
  
    if (!lastPayment?.payment) return true;
  
    const paidAt = new Date(lastPayment.payment);
    if (isNaN(paidAt.getTime())) return true;
  
    const daysLeft = Math.ceil(
      (addDays(paidAt, 30).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  
    // if payment window expired, account expired
    return daysLeft <= 0;
  }

module.exports = {
    sendActivationEmail, 
    sendRecoveryEmail, 
    sendInvitedUserEmail, 
    send, 
    emailReport,
};