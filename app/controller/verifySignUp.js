const { User } = require('../models');
const { Worker } = require('../models');
const { Admin } = require('../models');

module.exports = {
  checkDuplicateUserNamePhoneAndEmail(req, res, next) {
    User.findOne({
      where: {
        user_name: req.body.user_name,
      },
    }).then((userName) => {
      if (userName) {
        res.status(400).send({
          status: 'fail',
          user_name: req.body.user_name,
          message: 'User name is already taken!',
        });
        return;
      }

      User.findOne({
        where: {
          phone: req.body.phone,
        },
      }).then((phoneNbr) => {
        if (phoneNbr) {
          res.status(400).send({
            status: 'fail',
            phone: req.body.phone,
            message: 'Phone number is already taken!',
          });
          return;
        }

        User.findOne({
          where: {
            email: req.body.email,
          },
        }).then((mail) => {
          if (mail) {
            res.status(400).send({
              status: 'fail',
              email: req.body.email,
              message: 'E-mail is already taken!',
            });
            return;
          }
          next();
        });
      });
    });
  },

  checkDuplicateEmployeeJob(req, res, next) {
    Worker.findOne({
      where: {
        id: req.body.employee_id,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          status: 'fail',
          id: req.body.employee_id,
          name: req.body.name,
          message: 'The Worker has already taken job',
        });
        return;
      }
      next();
    });
  },

  checkDuplicateWorkerPhoneAndEmail(req, res, next) {
    Worker.findOne({
      where: {
        phone: req.body.phone,
      },
    }).then((phoneNbr) => {
      if (phoneNbr) {
        res.status(400).send({
          status: 'fail',
          phone: req.body.phone,
          message: 'Phone number is already taken!',
        });
        return;
      }

      Worker.findOne({
        where: {
          email: req.body.email,
        },
      }).then((mail) => {
        if (mail) {
          res.status(400).send({
            status: 'fail',
            email: req.body.email,
            message: 'E-mail is already taken!',
          });
          return;
        }
        next();
      });
    });
  },

  checkDuplicateAdminId(req, res, next) {
    Admin.findOne({
      where: {
        id: req.body.id,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          status: 'fail',
          id: req.body.id,
          message: 'Id is already taken!',
        });
        return;
      }
      next();
    });
  },
};
