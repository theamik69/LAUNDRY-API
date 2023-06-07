const jwt = require('jsonwebtoken');
const config = require('../config/configRoles');
const { Worker } = require('../models');

module.exports = {
  verifyToken(req, res, next) {
    const tokenHeader = req.headers['x-access-token'];

    if (tokenHeader.split(' ')[0] !== 'Bearer') {
      return res.status(500).send({
        auth: false,
        message: 'Error',
        errors: 'Incorrect token format',
      });
    }

    const token = tokenHeader.split(' ')[1];

    if (!token) {
      return res.status(403).send({
        auth: false,
        message: 'Error',
        errors: 'No token provided',
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: 'Error',
          errors: err,
        });
      }
      req.userId = decoded.id;
      next();
    });
  },

  isReceiver(req, res, next) {
    Worker.findByPk(req.userId)
      .then((user) => {
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            console.log(roles[i].name);
            if (roles[i].name.toUpperCase() === 'RECEIVER') {
              next();
              return;
            }
          }
          res.status(403).send({
            status: 'fail',
            message: 'Require Receiver Role',
          });
        });
      });
  },

  isLaundryman(req, res, next) {
    Worker.findByPk(req.userId)
      .then((user) => {
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            console.log(roles[i].name);
            if (roles[i].name.toUpperCase() === 'LAUNDRYMAN') {
              next();
              return;
            }
          }
          res.status(403).send({
            status: 'fail',
            message: 'Require Laundryman Role',
          });
        });
      });
  },

  isShipper(req, res, next) {
    Worker.findByPk(req.userId)
      .then((user) => {
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            console.log(roles[i].name);
            if (roles[i].name.toUpperCase() === 'SHIPPER') {
              next();
              return;
            }
          }
          res.status(403).send({
            status: 'fail',
            message: 'Require Shipper Role',
          });
        });
      });
  },

  isAdmin(req, res, next) {
    Worker.findByPk(req.userId)
      .then((user) => {
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            console.log(roles[i].name);
            if (roles[i].name.toUpperCase() === 'ADMIN') {
              next();
              return;
            }
          }
          res.status(403).send({
            status: 'fail',
            message: 'Require Admin Role',
          });
        });
      });
  },
};
