require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Worker } = require('../models');
const config = require('../config/configRoles');

module.exports = {
  signup(req, res) {
    return Worker
      .create({
        id: req.body.employee_id,
        job: req.body.job,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        phone: req.body.phone,
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
    return Worker
      .findOne({
        where: {
          id: req.body.employee_id,
        },
      }).then((user) => {
        if (!user) {
          return res.status(404).send({
            auth: false,
            id: req.body.employee_id,
            accessToken: null,
            message: 'Error',
            errors: 'User Not Found.',
          });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          return res.status(401).send({
            auth: false,
            id: req.body.employee_id,
            accessToken: null,
            message: 'Error',
            errors: 'Invalid Password!',
          });
        }

        const token = `Bearer ${jwt.sign({
          id: req.body.employee_id,
        }, config.secret, {
          expiresIn: 86400, // 24h expired
        })}`;

        res.status(201).send({
          status: 'success',
          id: req.body.employee_id,
          name: req.body.name,
          accessToken: token,
        });
      }).catch((err) => {
        res.status(500).send({
          status: false,
          id: req.body.employee_id,
          accessToken: null,
          message: 'Error',
          errors: err,
        });
      });
  },

  update(req, res) {
    return Worker
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
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
            phone: req.body.phone,
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
    return Worker
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

  allListWorker(req, res) {
    return Worker
      .findAll()
      .then((docs) => {
        const statuses = {
          status: 'success',
          count: docs.length,
          list_worker: docs.map((doc) => doc),
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

  deleteAllWorker(req, res) {
    return Worker
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
