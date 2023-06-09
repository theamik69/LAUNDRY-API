const jwt = require('jsonwebtoken');
const config = require('../config/configRoles');
const { Worker } = require('../models');
const { Admin } = require('../models');

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
        if (!user) {
          return res.status(403).send({
            status: 'fail',
            message: 'Id Not Found',
          });
        }

        if (user.job !== 'RECEIVER') {
          return res.status(403).send({
            status: 'fail',
            message: 'Require Receiver Role',
          });
        }

        next();
      })
      .catch((error) => {
        res.status(500).send({
          status: 'error',
          message: 'Internal Server Error',
          error: error.message,
        });
      });
  },

  isLaundryman(req, res, next) {
    Worker.findByPk(req.userId)
      .then((user) => {
        if (!user) {
          return res.status(403).send({
            status: 'fail',
            message: 'Id Not Found',
          });
        }

        if (user.job !== 'LAUNDRYMAN') {
          return res.status(403).send({
            status: 'fail',
            message: 'Require Laundryman Role',
          });
        }

        next();
      })
      .catch((error) => {
        res.status(500).send({
          status: 'error',
          message: 'Internal Server Error',
          error: error.message,
        });
      });
  },

  isShipper(req, res, next) {
    Worker.findByPk(req.userId)
      .then((user) => {
        if (!user) {
          return res.status(403).send({
            status: 'fail',
            message: 'Id Not Found',
          });
        }

        if (user.job !== 'SHIPPER') {
          return res.status(403).send({
            status: 'fail',
            message: 'Require Shipper Role',
          });
        }

        next();
      })
      .catch((error) => {
        res.status(500).send({
          status: 'error',
          message: 'Internal Server Error',
          error: error.message,
        });
      });
  },

  isAdmin(req, res, next) {
    Admin.findByPk(req.userId)
      .then((user) => {
        if (!user) {
          res.status(403).send({
            status: 'fail',
            message: 'Require Admin Role',
          });
          return;
        }
        next();
      })
      .catch((error) => {
        res.status(500).send({
          status: 'error',
          message: 'Internal Server Error',
          error: error.message,
        });
      });
  },
};
