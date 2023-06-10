const { User } = require('../models');
const { Order } = require('../models');

module.exports = {

  verifyUser(req, res, next) {
    User.findOne({
      where: {
        id: req.body.userid,
      },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'fail',
          id: req.body.userid,
          message: 'User Not Found.',
        });
      }
      next();
    });
  },

  verifyUserOrder(req, res, next) {
    Order.findOne({
      where: {
        id: req.params.orderid,
        user_id: req.userId,
      },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'fail',
          message: 'forbidden access',
        });
      }
      next();
    });
  },
};
