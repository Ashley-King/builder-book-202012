const passport = require('passport');
const Strategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models/User');

function setupGoogle({ ROOT_URL, server }) {
  const verify = async (accessToken, refreshToken, profile, verified) => {
    let email;
    let avatarUrl;

    if (profile.emails) {
      email = profile.emails[0].value;
    }

    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
    }
    // call and wait for user. signin or sign up
    try {
      const user = await User.signInOrSignUp({
        googleId: profile.id,
        email,
        googleToken: { accessToken, refreshToken },
        displayName: profile.displayName,
        avatarUrl,
      });
      verified(null, user);
    } catch (err) {
      verified(err);
      console.log(err);
    }
  };
  passport.use(
    new Strategy(
      // define verify method: get profile and google token from google
      // call and wait for static method user.signinorsignup to return created or existing user
      {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: `${ROOT_URL}/auth/google/`,
      },
      verify,
    ),
  );

  // serialize user and deserialized user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields(), (err, user) => {
      done(err, user);
    });
  });
  // initialize passport and passport's session
  server.use(passport.initialize());
  server.use(passport.session());

  // define express routes
  server.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    }),
  );

  server.get(
    '/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (__, res) => {
      // if successful redirect user to indec
      res.redirect('/');
    },
  );

  server.get('/logout', (req, res) => {
    // clear req.user property and user id from session & redirect to login page
    req.logout();
    res.redirect('/login');
  });
} // set up google

module.exports = setupGoogle;
