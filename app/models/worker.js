'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Worker extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
    }
  }
  Worker.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    job: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
  }, {
    hooks: {
      // eslint-disable-next-line no-unused-vars
      afterCreate: async (worker, option) => {
        console.log('>> worker afterCreate', sequelize?.models);
        // query insert into logs
        try {
          await sequelize.models.Auditlog.create({
            table_name: 'Workers',
            task: 'insert',
            description: `Proses Insert dengan data ${JSON.stringify(worker.toJSON())}`,
          });
        } catch (e) {
          console.log('>> error worker afterCreate', e);
        }
      },
    },
    sequelize,
    modelName: 'Worker',
  });
  return Worker;
};
