const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
import Permission from "../models/Permission";

const _ = require('lodash');
// exports.authMiddleware = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     res.status(401).send('You are not authenticated')
//   } else {
//     req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
//     return next()
//   }
// };

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
exports.authJwtSession = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-rn77drwl.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://gmarshall.us',
  issuer: `https://dev-rn77drwl.auth0.com/`,
  algorithms: ['RS256']
// }, (req, res, next) => {
//   next();
});

exports.setJwtUser = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-rn77drwl.auth0.com/.well-known/jwks.json`
  }),
  credentialsRequired: false,

  // Validate the audience and the issuer.
  audience: 'https://gmarshall.us',
  issuer: `https://dev-rn77drwl.auth0.com/`,
  algorithms: ['RS256']
}, (req, res, next) => {
  next();
});

exports.getPermissions = async (req, res, next) => {
  console.log(`req.user: ${JSON.stringify(req.user)}`);
  if(req.user) {
    const userPermissions = [];
    if(req.user.permissions) {
      const perms = await Permission.findAll({where: {name: req.user.permissions}});
      _.forEach(perms, it => userPermissions.push(it.id));
    }
    req.user.userPermissions = userPermissions;
  }
  next();
};
