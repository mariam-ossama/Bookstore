// bookStoreModels/book.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Book = sequelize.define('Book', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    pages: { type: DataTypes.INTEGER },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Authors',
        key: 'id',
      },
    },
  });

  return Book;
};
