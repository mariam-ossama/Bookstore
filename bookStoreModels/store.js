// bookStoreModels/store.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
  });
  return Store;
};
