import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IGoogleUser } from '../types/auth.types';
import env from './env.config';

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID as string,
        clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const googleUser: IGoogleUser = {
            id: profile.id,
            email: profile.emails && profile.emails[0].value ,
            displayName: profile.displayName || '',
            profilePicture: profile.photos && profile.photos[0].value
          };          
          return done(null, googleUser);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
}