require("dotenv").config();
const path = require('path');
import { Server } from 'socket.io';
import http from "http";
import express, { Express, Request, Response, NextFunction } from 'express';
import { startAgenda } from "./helpers/agenda";
const { createProxyMiddleware } = require('http-proxy-middleware');
const app: Express = express();

app.use(
  '/blog',
  createProxyMiddleware({
    target: 'https://98.88.2.14',   // Lightsail WP
    changeOrigin: false,            // keep Host from headers
    xfwd: true,
    secure: false,                  // set to true once SSL on that IP is fully correct
    headers: {
      Host: 'salesdoing.com',       // what WP expects
    },
    pathRewrite: {
      '^/blog': '/blog',            // /blog/wp-login.php -> /blog/wp-login.php (no weird extra slash)
    },
    timeout: 120000,
    proxyTimeout: 120000,
    logLevel: 'debug',
    onError(err: any, req: any, res: any) {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Proxy error: ' + err.message);
      }
    },
  })
);

// 0) Normalize admin URLs: if WP ever sends /wp-admin, push it back to /blog/wp-admin
/*
app.use((req: Request, res: Response, next: NextFunction) => {
  // redirect /wp-admin... -> /blog/wp-admin...
  if (req.url.startsWith('/wp-admin')) {
    const rest = req.url.slice('/wp-admin'.length);  // keep any sub-path or query
    return res.redirect(302, `/blog/wp-admin${rest}`);
  }

  // optional: redirect bare /wp-login.php -> /blog/wp-login.php
  if (req.url === '/wp-login.php') {
    return res.redirect(302, '/blog/wp-login.php');
  }

  next();
});
*/

app.use((req: Request, res: Response, next: NextFunction) => {
  // Normalize /wp-admin -> /blog/wp-admin (including subpaths)
  if (req.url.startsWith('/wp-admin')) {
    const rest = req.url.slice('/wp-admin'.length) || '/';

    // GET can be 302, POST/others should be 307 so the body is preserved
    const status = req.method === 'GET' ? 302 : 307;

    return res.redirect(status, `/blog/wp-admin${rest}`);
  }

  // Normalize bare /wp-login.php -> /blog/wp-login.php
  if (req.url === '/wp-login.php') {
    const status = req.method === 'GET' ? 302 : 307;
    return res.redirect(status, '/blog/wp-login.php');
  }

  next();
});

app.use(
  '/blog',
  createProxyMiddleware({
    target: 'https://98.88.2.14',   // Lightsail WP
    changeOrigin: false,
    xfwd: true,
    secure: false,
    headers: {
      Host: 'salesdoing.com',
    },
    pathRewrite: {
      '^/blog': '/blog',            // /blog/wp-admin -> /blog/wp-admin
    },
    timeout: 120000,
    proxyTimeout: 120000,
    logLevel: 'debug',
    onError(err: any, req: any, res: any) {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Proxy error: ' + err.message);
      }
    },
  })
);

// 2) Proxy bare /wp-admin and /wp-login.php into the same blog install
/*
app.use(
  ['/wp-admin', '/wp-login.php'],
  createProxyMiddleware({
    target: 'https://98.88.2.14',
    changeOrigin: false,
    xfwd: true,
    secure: false,
    headers: {
      Host: 'salesdoing.com',
    },
    pathRewrite: {
      '^/wp-admin': '/blog/wp-admin',       // /wp-admin/... -> /blog/wp-admin/...
      '^/wp-login.php': '/blog/wp-login.php'
    },
    timeout: 120000,
    proxyTimeout: 120000,
    logLevel: 'debug',
    onError(err: any, req: any, res: any) {
      console.error('Proxy error (/wp-admin):', err.message);
      if (!res.headersSent) {
        res.status(500).send('Proxy error: ' + err.message);
      }
    },
  })
);
*/

//Set Request Size Limit
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
//app.use(express.urlencoded({limit: '50mb'}));
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

/* Catch casscading errors on Session collection if someone already logged in accepts an invite to another company */
process.on('unhandledRejection', (reason: any) => {
  if (reason instanceof mongoose.Error.DocumentNotFoundError) {
    console.warn('⚠️ Ignored missing document:', reason.message);
    return;
  }
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 3500;
mongoose.set('strictQuery', true); // or false depending on your app’s needs
connectDB(); // connect to MongoDB

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
      else
        next()
    })
  }

/*
app.use(
  '/blog',
  createProxyMiddleware({
    target: 'https://98.88.2.14',
    changeOrigin: true,
    xfwd: true,
    pathRewrite: {
      '^/blog/?': '/',   // /blog/... -> /...
    },
    logLevel: 'debug',
  })
);
*/


app.use(credentials);
/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));
// built-in middleware for json 
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

const publicPath = path.join(__dirname, '..', 'client', 'build');

app.use(express.static(publicPath));

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/invite', require('./routes/invite'));
    app.use('/api/utility', require('./routes/utility'));
   // app.use("/api/stripe/webhook", require('./routes/stripeWebhook'));

    /* When adding a protected api route below, so that refresh works on the heroku
       producton site, make sure to add the route inside the verifyJWT middleware 
     */

    app.use(verifyJWT); // Protected API Routes below

    app.use('/api/company', require('./routes/company'));
    app.use('/api/settings', require('./routes/settings'));
    app.use('/api/stripe', require('./routes/stripe'));
    app.use('/api/report', require('./routes/report'));
    app.use('/api/docs', require('./routes/docs'));
   
    app.get("*", (req: Request, res: Response) => { 
        res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });
    
    const server = http.createServer(app);
    const io = new Server(server, {
      pingInterval: 25000,
      pingTimeout: 60000, // give clients longer to respond before disconnecting
      cors: {
        origin: process.env.SITE_DOMAIN,
        credentials: true,
      },
    });

    /*
    mongoose.connection.once('open', () => {
        //app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
    */

    mongoose.connection.once("open", () => {
      server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
      // ✅ Start Agenda AFTER server is listening (and don't block startup)
      startAgenda()
        .then(() => console.log("Agenda started"))
        .catch((err) => console.error("Agenda failed to start:", err));
    });


  
