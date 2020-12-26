const express = require('express');
const next = require('next');

const mongoose = require('mongoose');

const session = require('express-session');
const mongoSessionStore = require('connect-mongo');

const User = require('./models/User');

require('dotenv').config();

const options = {
  useNewParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL, options);

const port = process.env.PORT || 8000;
const ROOT_URL = `http://loclahost:${port}`;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const MongoStore = mongoSessionStore(session);

  const sess = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  };
  server.use(session(sess));

  server.get('/', async (req, res) => {
    req.session.foo = 'bar';
    const user = await User.findOne({ slug: 'ashley' });
    app.render(req, res, '/', { user });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on ${ROOT_URL}`);
  });
});
