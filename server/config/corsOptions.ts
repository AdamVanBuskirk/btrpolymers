
const allowedOrigins = process?.env?.ALLOWED_ORIGINS?.split(',');

const corsOptions = {
    origin: (origin: string, callback: any) => {
        if (allowedOrigins?.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;