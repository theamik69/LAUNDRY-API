const verifySignUpController = require('../controller/verifySignUp');
const userController = require('../controller/userController');
const workerController = require('../controller/workerController');
const adminController = require('../controller/adminController');
const verifyJwtTokenController = require('../controller/verifyJwtToken');
const verifyUser = require('../controller/verifyUser');
const orderController = require('../controller/orderController');

module.exports = function (app) {
  app.post(
    '/user/registration',
    verifySignUpController.checkDuplicateUserNamePhoneAndEmail,
    userController.signup,
  );

  app.post('/user/signin', userController.signin);

  app.patch(
    '/user/:userid',
    verifyJwtTokenController.verifyToken,
    userController.update,
  );

  app.delete(
    '/user/:userid',
    verifyJwtTokenController.verifyToken,
    userController.delete,
  );

  app.post(
    '/admin/signup',
    verifySignUpController.checkDuplicateAdminId,
    adminController.signup,
  );

  app.post(
    '/admin/signin',
    adminController.signin,
  );

  app.patch(
    '/admin/:id',
    verifyJwtTokenController.verifyToken,
    adminController.update,
  );

  app.delete(
    '/admin/:id',
    verifyJwtTokenController.verifyToken,
    adminController.delete,
  );

  app.get(
    '/admin/alladmin',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    adminController.allListAdmin,
  );

  app.get(
    '/admin/alluser',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    userController.allListUser,
  );

  app.get(
    '/admin/allworker',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    workerController.allListWorker,
  );

  app.post(
    '/admin/worker/registration',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    verifySignUpController.checkDuplicateEmployeeJob,
    verifySignUpController.checkDuplicateWorkerPhoneAndEmail,
    workerController.signup,
  );

  app.post('/worker/signin', workerController.signin);

  app.patch(
    '/worker/:id',
    verifyJwtTokenController.verifyToken,
    workerController.update,
  );

  app.delete(
    '/admin/worker/:id',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    workerController.delete,
  );

  app.post(
    '/order',
    verifyJwtTokenController.verifyToken,
    orderController.add,
  );

  app.patch(
    '/worker/receiver/:orderid',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isReceiver,
    orderController.addReceiverStatusByWorker,
  );

  app.patch(
    '/worker/laundryman/:orderid',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isLaundryman,
    orderController.addLaundrymanStatusByWorker,
  );

  app.patch(
    '/worker/shipper/:orderid',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isShipper,
    orderController.addShipperStatusByWorker,
  );

  app.get(
    '/admin/allorder',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    orderController.allListOrder,
  );

  app.get(
    '/order/:userid',
    verifyJwtTokenController.verifyToken,
    orderController.listOrderUser,
  );
  app.get(
    '/order/:userid/:orderid',
    verifyJwtTokenController.verifyToken,
    verifyUser.verifyUserOrder,
    orderController.getOrderById,
  );

  app.patch(
    '/order/:userid/:orderid',
    verifyJwtTokenController.verifyToken,
    verifyUser.verifyUserOrder,
    orderController.userChangeDeliveryTo,
  );

  app.delete(
    '/order/:userid/:orderid',
    verifyJwtTokenController.verifyToken,
    verifyUser.verifyUserOrder,
    orderController.cancelOrderByUser,
  );

  // Untuk mengosongkan database ketika akan mengulang pengetesan

  app.delete(
    '/worker',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    workerController.deleteAllWorker,
  );

  app.delete(
    '/user',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    userController.deleteAllUser,
  );

  app.delete(
    '/order',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    orderController.deleteAllOrder,
  );

  app.delete(
    '/admin',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    adminController.deleteAllAdmin,
  );
};
