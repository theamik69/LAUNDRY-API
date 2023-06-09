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
    sequelize,
    modelName: 'Worker',
  });
  return Worker;
};
