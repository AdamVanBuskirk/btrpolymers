//const allowedOrigins = process.env.ALLOWED_ORIGINS!.split(',');

import { Request, Response, NextFunction } from 'express';

const credentials = (req: Request, res: Response, next: NextFunction) => {
    let origin = req.headers.origin!;
    //if (allowedOrigins?.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    //}
    next();
}

module.exports = credentials