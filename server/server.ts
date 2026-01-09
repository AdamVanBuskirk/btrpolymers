require("dotenv").config();
const path = require('path');
import http from "http";
import express, { Express, Request, Response } from 'express';
const app: Express = express();
//Set Request Size Limit
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
//app.use(express.urlencoded({limit: '50mb'}));
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
      else
        next()
    })
}

/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));
// built-in middleware for json 
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

const publicPath = path.join(__dirname, '..', 'client', 'build');

app.use(express.static(publicPath));

app.get("*", (req: Request, res: Response) => { 
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    



  
