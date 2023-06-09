const verifySignUpController = require('../controller/verifySignUp');
const userController = require('../controller/userController');
const workerController = require('../controller/workerController');
const adminController = require('../controller/adminController');
const verifyJwtTokenController = require('../controller/verifyJwtToken');
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

  // app.get(
  //   '/reservation/:userid',
  //   verifyJwtTokenController.verifyToken,
  //   bookingController.listBookingUser,
  // );
  // app.get(
  //   '/reservation/:userid/:bookingid',
  //   verifyJwtTokenController.verifyToken,
  //   verifyUser.verifyUserBooking,
  //   bookingController.getBookingById,
  // );
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
