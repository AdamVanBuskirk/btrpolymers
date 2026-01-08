import { Request, Response } from 'express';
const fns = require('date-fns');
const mailController = require('../controllers/mailController');
import { isValidEmail } from '../helpers/isValidEmail';
//import { IFeedback } from '../models/domain/Feedback';
const EmailLog = require('../models/domain/EmailLog');
//const Waitlist = require('../models/domain/Waitlist');
//const Feedback = require('../models/domain/Feedback');

interface Email {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
}

/* Load the correct container based on loaded project */
const emailSales = async (req: Request, res: Response) => {
    
    let { firstName, lastName, email, message } = req.body;
    
    if (firstName === "") return res.status(400).json({ 'message': 'firstName is required.' });
    if (lastName === "") return res.status(400).json({ 'message': 'lastName is required.' });
    if (!isValidEmail(email)) return res.status(400).json({ 'message': 'Email is required.' });
    if (message === "") return res.status(400).json({ 'message': 'Message is required.' });

    try {

        const emailMessage: Email = {
            to: "support@salesdoing.com",
            from: "support@salesdoing.com",
            subject: "A message from the SalesDoing Contact Page",
            text: "First Name:" + firstName + "\nLast Name: " + lastName + "\nEmail: " + email + "\nMessage: " + message,
            html: "<div>First Name: " + firstName + "</div><div>Last Name: " + lastName + "</div><div>Email: " + email + "</div><div>Message: " + message + "</div>",
        }

        mailController.send(emailMessage);
        EmailLog.create({
            //id: id,
            to: emailMessage.to,
            from: email,
            subject: emailMessage.subject,
            textMessage: emailMessage.text,
            htmlMessage: emailMessage.html,
            sent: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")
        });

        res.sendStatus(200);

    } catch (err) {
        res.status(500).json({ 'message': 'Server Error' });
    } 
}

module.exports = {
    emailSales,
};