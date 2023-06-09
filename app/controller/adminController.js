require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const config = require('../config/configRoles');

module.exports = {

  signup(req, res) {
    return Admin
      .create({
        id: req.body.id,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 8),
      }).then((user) => {
        res.status(201).send({
          status: 'success',
          id: user.id,
          message: 'User registered successfully!',
        });
      }).catch((err) => {
        res.status(500).send({
          auth: false,
          message: 'Error',
          errors: err,
        });
      });
  },

  signin(req, res) {
    return Admin
      .findOne({
        where: {
          id: req.body.id,
        },
      }).then((user) => {
        if (!user) {
          return res.status(404).send({
            auth: false,
            id: req.body.id,
            accessToken: null,
            message: 'Error',
            errors: 'User Not Found.',
          });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          return res.status(401).send({
            auth: false,
            id: req.body.id,
            accessToken: null,
            message: 'Error',
            errors: 'Invalid Password!',
          });
        }

        const token = `Bearer ${jwt.sign({
          id: req.body.id,
        }, config.secret, {
          expiresIn: 86400, // 24h expired
        })}`;

        res.status(201).send({
          status: 'success',
          id: req.body.id,
          accessToken: token,
        });
      }).catch((err) => {
        res.status(500).send({
          status: false,
          id: req.body.id,
          accessToken: null,
          message: 'Error',
          errors: err,
        });
      });
  },

  update(req, res) {
    return Admin
      .findByPk(req.params.id, {})
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            status_response: 'Bad Request',
            errors: 'User Not Found',
          });
        }

        return user
          .update({
            password: bcrypt.hashSync(req.body.password, 8),
          })
          .then(() => {
            const status = {
              status: 'success',
              message: 'The data has been updated',
            };
            return res.status(200).send(status);
          })
          .catch((error) => {
            res.status(400).send({
              status_response: 'Bad Request',
              errors: error,
            });
          });
      })
      .catch((error) => {
        res.status(400).send({
          status_response: 'Bad Request',
          errors: error,
        });
      });
  },

  delete(req, res) {
    return Admin
      .findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            status_response: 'Bad Request',
            errors: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(200).send({
            status: 'success',
            message: 'User account has been deleted',
          }))
          .catch((error) => {
            res.status(400).send({
              status_response: 'Bad Request',
              errors: error,
            });
          });
      })
      .catch((error) => {
        res.status(400).send({
          status_response: 'Bad Request',
          errors: error,
        });
      });
  },

  allListAdmin(req, res) {
    return Admin
      .findAll()
      .then((docs) => {
        const statuses = {
          status: 'success',
          count: docs.length,
          list_user: docs.map((doc) => doc.id),
        };
        res.status(200).send(statuses);
      })
      .catch((error) => {
        res.status(400).send({
          status_response: 'Bad Request',
          errors: error,
        });
      });
  },

  deleteAllAdmin(req, res) {
    return Admin
      .truncate()
      .then(() => {
        const statuses = {
          status: 'success',
          message: 'Delete all data success',
        };
        return res.status(200).send(statuses);
      })
      .catch((error) => {
        res.status(400).send({
          status_response: 'Bad Request',
          errors: error,
        });
      });
  },
};
