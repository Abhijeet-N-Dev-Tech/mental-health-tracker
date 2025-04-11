import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { User } from './models';

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
  const [user] = await User.findOrCreate({
    where: { googleId: profile.id },
    defaults: {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0].value || ''
    }
  });
  return done(null, user);
}));

export function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}
