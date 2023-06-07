'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const roles = [
      {
        id: 1,
        role: 'RECEIVER',
      },
      {
        id: 2,
        role: 'LAUNDRYMAN',
      },
      {
        id: 3,
        role: 'SHIPPER',
      },
      {
        id: 4,
        role: 'ADMIN',
      },
    ];
    await queryInterface.bulkInsert('Roles', roles);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Roles');
  },
};
