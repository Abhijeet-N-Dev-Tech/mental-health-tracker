import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import routes from './routes';
import './auth';
import { sequelize } from './models';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedDomain = process.env.CLIENT_APP_DOMAIN;
    const devOrigin = process.env.CLIENT_APP_URL;

    if (!origin) return callback(null, true);

    try {
      const hostname = new URL(origin).hostname;

      if (
        origin === devOrigin ||
        hostname === allowedDomain ||
        hostname.endsWith(`.${allowedDomain}`)
      ) {
        return callback(null, true);
      }
    } catch (err) {
      return callback(new Error('Invalid origin'));
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // or true — allows HTTPS detection behind proxy
}

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
  });
});
