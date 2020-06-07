import express from 'express';
import cors from 'cors';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import menuRoutes from './routes/menuRoutes';
import quoteRoutes from './routes/quoteRoutes';
import noteRoutes from './routes/noteRoutes';
import sequelize from './database/sequelize';

const app = express();
const router = express.Router();
// const jwt = require('express-jwt');
// const jwtAuthz = require('express-jwt-authz');
// const jwksRsa = require('jwks-rsa');
//
// // Authentication middleware. When used, the
// // Access Token must exist and be verified against
// // the Auth0 JSON Web Key Set
// const authJwtSession = jwt({
//   // Dynamically provide a signing key
//   // based on the kid in the header and
//   // the signing keys provided by the JWKS endpoint.
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://dev-rn77drwl.auth0.com/.well-known/jwks.json`
//   }),
//
//   // Validate the audience and the issuer.
//   audience: 'https://gmarshall.us',
//   issuer: `https://dev-rn77drwl.auth0.com/`,
//   algorithms: ['RS256']
// });

app.disable('x-powered-by');

// connect to sequelize; added retries for docker connections
let isConnected = false;
let cnt = 0;
sequelize
  .authenticate()
  .then( () => {
    console.log('Connection has been established successfully.');
    isConnected = true;
  })
  .catch(err => {
    console.error(`Unable to connect to the database: cnt: ${cnt}: `, err);
  });

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(cors(
  {
    credentials: true,
    origin: [
      'http://localhost:8080',
      'http://www.appfactory.com:8080',
      'http://www.appfactory.com',
      'https://www.appfactory.com'
    ]
  }));
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
router.get('/', (req, res) => {
    res.render('index', { title: 'Express Babel' });
});
app.use('/', router);
router.get('/about', (req, res) => {
    res.render('index', { title: 'About Express Babel' });
});
app.use('/about', router);

app.use('/menus', menuRoutes);
app.use('/quotes', quoteRoutes);
app.use('/notes', noteRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
