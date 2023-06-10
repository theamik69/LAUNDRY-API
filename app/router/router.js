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

  app.post(
    '/admin/signup',
    verifySignUpController.checkDuplicateAdminId,
    adminController.signup,
  );

  app.post('/user/signin', userController.signin);

  app.post('/admin/signin', adminController.signin);

  app.post('/worker/signin', workerController.signin);

  app.post(
    '/admin/worker/registration',
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isAdmin,
    verifySignUpController.checkDuplicateEmployeeJob,
    verifySignUpController.checkDuplicateWorkerPhoneAndEmail,
    workerController.signup,
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

  // app.patch(
  //   '/user/:userid',
  //   verifyJwtTokenController.verifyToken,
  //   userController.update,
  // );
  // app.delete(
  //   '/user/:userid',
  //   verifyJwtTokenController.verifyToken,
  //   userController.delete,
  // );
};
