const { nanoid } = require('nanoid');
const { Price } = require('../models');
const { Order } = require('../models');

module.exports = {

  add(req, res) {
    Price.findOne({
      where: {
        laundry_tipe: req.body.laundry_tipe,
      },
    })
      .then((price) => {
        if (!price) {
          return res.status(404).send({
            status_response: 'Not Found',
            errors: 'Price not found.',
          });
        }

        const orderId = `order-${nanoid(12)}`;
        const laundryPrice = price.price;
        const quantity = req.body.qty;
        const totalPrice = laundryPrice * quantity;

        return Order.create({
          id: orderId,
          user_id: req.body.user_id,
          name: req.body.name,
          laundry_tipe: req.body.laundry_tipe,
          qty: req.body.qty,
          pickup_at: req.body.pickup_at,
          delivery_to: req.body.delivery_to,
          total_price: totalPrice,
        });
      })
      .then((data) => {
        const status = {
          status: 'success',
          id: data.id,
          totalPrice: data.total_price,
          message: 'Pickup arranged',
        };
        return res.status(200).send(status);
      })
      .catch((error) => {
        res.status(400).send({
          status_response: 'Bad Request',
          errors: error,
        });
      });
  },

  allListOrder(req, res) {
    return Order
      .findAll()
      .then((docs) => {
        const statuses = {
          status: 'success',
          count: docs.length,
          list_order: docs.map((doc) => doc),
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

  listOrderUser(req, res) {
    return Order
      .findAll({
        include: [],
        where: {
          user_id: req.params.userid,
        },
        order: [
          ['createdAt', 'DESC'],
        ],
      })
      .then((docs) => {
        const statuses = {
          status: 'success',
          count: docs.length,
          list_order: docs.map((doc) => doc),
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

  getOrderById(req, res) {
    return Order
      .findOne({
        where: {
          id: req.params.orderid,
        },
      })
      .then((doc) => {
        if (!doc) {
          res.status(404).send({
            status_response: 'Not Found',
            errors: 'Status Not Found',
          });
        }

        if (doc.shipper_status === null) {
          const status = {
            status: 'success',
            id: doc.id,
            totalPrice: doc.total_price,
            message: 'Still being washed',
          };
          res.status(200).send(status);
        }

        if (doc.shipper_status === 'DELIVERED') {
          const status = {
            status: 'success',
            id: doc.id,
            totalPrice: doc.total_price,
            message: 'Has been delivered',
          };
          res.status(200).send(status);
        }
      })
      .catch((error) => {
        res.status(400).send({
          status_response: 'Bad Request',
          errors: error,
        });
      });
  },

  userChangeDeliveryTo(req, res) {
    return Order
      .findByPk(req.params.orderid, {})
      .then((doc) => {
        const previousAddress = doc.delivery_to;

        if (!doc) {
          return res.status(404).send({
            status_response: 'Bad Request',
            errors: 'Order Not Found',
          });
        }

        if (doc.shipper_status === 'DELIVERED') {
          return res.status(403).send({
            status_response: 'Bad Request',
            errors: 'The order has done',
          });
        }

        return doc
          .update({
            delivery_to: req.body.delivery_to,
          })
          .then((newdoc) => {
            const status = {
              status: 'success',
              message: `The shipping address has been modified from the previous destination in ${previousAddress} to ${newdoc.delivery_to}. `,
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

  cancelOrderByUser(req, res) {
    return Order
      .findByPk(req.params.orderid)
      .then((data) => {
        if (!data) {
          return res.status(400).send({
            status_response: 'Bad Request',
            errors: 'Order Not Found',
          });
        }

        if (data && data.receiver_status === 'CONFIRMED') {
          return res.status(400).send({
            message: 'Sorry, the order cannot be canceled at this time as it has already been processed.',
          });
        }

        return data
          .destroy()
          .then(() => res.status(200).send({
            status: 'success',
            message: 'Order has been cancel',
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

  addReceiverStatusByWorker(req, res) {
    return Order
      .findByPk(req.params.orderid, {})
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({
            status_response: 'Bad Request',
            errors: 'Order Not Found',
          });
        }

        return doc
          .update({
            receiver_status: req.body.receiver_status,
          })
          .then(() => {
            const status = {
              status: 'success',
              message: 'Receiver status has been confirmed',
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

  addLaundrymanStatusByWorker(req, res) {
    return Order
      .findByPk(req.params.orderid, {})
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({
            status_response: 'Bad Request',
            errors: 'Order Not Found',
          });
        }

        if (doc.receiver_status === null) {
          return res.status(400).send({
            status_response: 'Bad Request',
            errors: 'The Laundryman status cannot be updated because the Receiver status has not been confirmed yet.',
          });
        }

        return doc
          .update({
            laundryman_status: req.body.laundryman_status,
          })
          .then(() => {
            const status = {
              status: 'success',
              message: 'Laundryman status has been confirmed',
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

  addShipperStatusByWorker(req, res) {
    return Order
      .findByPk(req.params.orderid, {})
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({
            status_response: 'Bad Request',
            errors: 'Order Not Found',
          });
        }

        if (doc.laundryman_status === null) {
          return res.status(400).send({
            status_response: 'Bad Request',
            errors: 'The Shipper status cannot be updated because the Laundryman status has not been confirmed yet.',
          });
        }

        return doc
          .update({
            shipper_status: req.body.shipper_status,
          })
          .then(() => {
            const status = {
              status: 'success',
              message: 'Shipper status has been confirmed',
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

  deleteAllOrder(req, res) {
    return Order
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
