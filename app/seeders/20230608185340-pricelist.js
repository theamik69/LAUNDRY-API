'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const pricelist = [
      {
        id: 1,
        laundry_tipe: 'LAUNDRY KILOAN',
        price: 10000,
      },
      {
        id: 2,
        laundry_tipe: 'JAS',
        price: 50000,
      },
      {
        id: 3,
        laundry_tipe: 'HANDUK BESAR',
        price: 25000,
      },
      {
        id: 4,
        laundry_tipe: 'HANDUK KECIL',
        price: 20000,
      },
      {
        id: 5,
        laundry_tipe: 'BAD COVER',
        price: 50000,
      },
      {
        id: 6,
        laundry_tipe: 'SEPATU',
        price: 50000,
      },
    ];
    await queryInterface.bulkInsert('Prices', pricelist);
  },

  async down(queryInterface) {
    const pricelist = [
      {
        id: 1,
        laundry_tipe: 'LAUNDRY KILOAN',
        price: 10000,
      },
      {
        id: 2,
        laundry_tipe: 'JAS',
        price: 50000,
      },
      {
        id: 3,
        laundry_tipe: 'HANDUK BESAR',
        price: 25000,
      },
      {
        id: 4,
        laundry_tipe: 'HANDUK KECIL',
        price: 20000,
      },
      {
        id: 5,
        laundry_tipe: 'BAD COVER',
        price: 50000,
      },
      {
        id: 6,
        laundry_tipe: 'SEPATU',
        price: 50000,
      },
    ];
    await queryInterface.bulkDelete('Prices', pricelist);
  },
};
