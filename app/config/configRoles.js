require('dotenv').config();

module.exports = {
  secret: process.env.SECRET,
  ROLES: ['RECEIVER', 'LAUNDRYMAN', 'SHIPPER', 'ADMIN'],
};
