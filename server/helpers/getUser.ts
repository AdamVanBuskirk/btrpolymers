const User = require('../models/domain/User');
const Session = require('../models/domain/Session');
const CompanyUser = require('../models/domain/CompanyUser');
import { IUser } from '../models/domain/User';

export const getUser = async (cookies: any, collection?: string, id?: string, action?: string): Promise<IUser | null> => {
    
    /* Start by setting user to null and checking that the user is logged in. If they are 
       NOT logged in, then immediately return null. If they ARE logged in, proceed to 
       ensure the objects they are querying belong to them.
     */ 

    let foundUser = null;
    let foundSession = null;
    let foundCompany = null;

    if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        foundSession = await Session.findOne({ refreshToken: refreshToken }).exec();
    }
    
    if (foundSession === null) {
        return foundUser;
    } else {
        foundUser = await User.findOne({ _id: foundSession.userId }).exec();
    }

    if (collection === "company") {
        foundCompany = await CompanyUser.findOne({ companyId: id, userId: foundUser._id }).exec();
        if (foundCompany === null) return null;
    }

    return foundUser;
}


