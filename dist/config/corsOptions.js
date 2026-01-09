"use strict";
var _a, _b;
const allowedOrigins = (_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.ALLOWED_ORIGINS) === null || _b === void 0 ? void 0 : _b.split(',');
const corsOptions = {
    origin: (origin, callback) => {
        if ((allowedOrigins === null || allowedOrigins === void 0 ? void 0 : allowedOrigins.indexOf(origin)) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
module.exports = corsOptions;
