'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Order.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    user_id: DataTypes.STRING,
    name: DataTypes.STRING,
    laundry_tipe: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    pickup_at: DataTypes.STRING,
    delivery_to: DataTypes.STRING,
    total_price: DataTypes.INTEGER,
    receiver_status: DataTypes.STRING,
    laundryman_status: DataTypes.STRING,
    shipper_status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
