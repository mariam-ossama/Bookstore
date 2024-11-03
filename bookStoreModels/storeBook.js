// bookStoreModels/storeBook.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StoreBook = sequelize.define('StoreBook', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'id',
      },
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'id',
      },
    },
    price: { type: DataTypes.FLOAT, allowNull: false },
  });

  return StoreBook;
};
