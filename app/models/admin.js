'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
    }
  }
  Admin.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    role: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    hooks: {
      // eslint-disable-next-line no-unused-vars
      afterCreate: async (admin, option) => {
        console.log('>> admin afterCreate', sequelize?.models);
        // query insert into logs
        try {
          await sequelize.models.Auditlog.create({
            table_name: 'Admins',
            task: 'insert',
            description: `Proses Insert dengan data ${JSON.stringify(admin.toJSON())}`,
          });
        } catch (e) {
          console.log('>> error admin afterCreate', e);
        }
      },
    },
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};
