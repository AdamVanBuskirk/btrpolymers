import { dtoUser } from '../models/dto/dtoUser';
import { isValidEmail } from '../helpers/isValidEmail';
import { Request, Response, NextFunction } from 'express';

const isValidUser = (req: Request, res: Response, next: NextFunction) => {

    const user: dtoUser | null = req?.body?.user;
    
    if (user) { 
        if ( !isValidEmail(user.email)) {
            return res.status(422).json({ error: "Invalid email address"});
        } else if (user.firstName === "") {
            return res.status(422).json({ error: "First Name is Required"});
        } else if (user.lastName === "") {
            return res.status(422).json({ error: "Last Name is Required"});
        }
    }
    next();
}

module.exports = isValidUser;