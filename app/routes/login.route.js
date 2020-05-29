'use strict';

var ldap = require('../functions/ldap.js');
const requiredGroup = 'admins';

function route_login (config) {
  return function (req, res, next) {
    return ldap(req.body.username, function(groups) {
    for (var i = 0; i < config.credentials.length; i++) {
      if (
        req.body.username === config.credentials[i].username &&
        req.body.password === config.credentials[i].password && 
        groups.indexOf(requiredGroup) >= 0
      ) {
        req.session.loggedIn = true;
        req.session.username = config.credentials[i].username;
        req.session.groups = groups;
        res.json({
          status  : 1,
          message : config.lang.api.loginSuccessful
        });
        return;
      } 
    }

    if(groups.indexOf(requiredGroup) < 0) {
      res.json({
        status  : 0,
        message : config.lang.api.invalidPermissions
      });
    } else {
      res.json({
        status  : 0,
        message : config.lang.api.invalidCredentials
      });
    }

    

    });
  };
}

function success(req, res, config) {
  req.session.loggedIn = true;
  req.session.username = config.credentials[i].username;
  res.json({
    status  : 1,
    message : config.lang.api.loginSuccessful
  });
}

function reject(res, flag) {
  res.json({
    status  : 0,
    message : flag
  });
}

// Exports
module.exports = route_login;
