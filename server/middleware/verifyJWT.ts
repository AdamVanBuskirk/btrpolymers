const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    if (
        req.url.includes('/api/project') || req.url.includes('/api/settings') ||
        req.url.includes('/api/folder')
    ) {
        //|| req.url.includes('/api/stripe')
    //if (req.url === '/api/project' || req.url === '/api/settings' || req.url === '/api/analytics') {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err: any, decoded: any) => {
                if (err) return res.sendStatus(403); //invalid token
                /* The below line was in before typescript conversion, but I think it was an error. We
                don't have or need a user on the request, we just need to pass forward when check passes,
                so I commented it out. Leaving this note in case it does end up being an issue / or is needed.
                */
                //req.user = decoded.email;
                next();
            }
        );
    } else {
        next();
    }
}

module.exports = verifyJWT