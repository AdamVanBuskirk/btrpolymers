"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const path = require('path');
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//Set Request Size Limit
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: false }));
//app.use(express.urlencoded({limit: '50mb'}));
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`);
        else
            next();
    });
}
/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));
// built-in middleware for json 
app.use(express_1.default.json());
//middleware for cookies
app.use(cookieParser());
const publicPath = path.join(__dirname, '..', 'client', 'build');
app.use(express_1.default.static(publicPath));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
const server = http_1.default.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
