// config/databaseConfig.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
});

// Import models
const Store = require('../bookStoreModels/store')(sequelize);
const Author = require('../bookStoreModels/author')(sequelize);
const Book = require('../bookStoreModels/book')(sequelize);
const StoreBook = require('../bookStoreModels/storeBook')(sequelize);

// Define relationships
Author.hasMany(Book, { foreignKey: 'author_id' });
Book.belongsTo(Author, { foreignKey: 'author_id' });

Store.belongsToMany(Book, { through: StoreBook, foreignKey: 'store_id', otherKey: 'book_id' });
Book.belongsToMany(Store, { through: StoreBook, foreignKey: 'book_id', otherKey: 'store_id' });


// Many-to-Many relationship between Store and Book through StoreBook
Store.belongsToMany(Book, { through: StoreBook, foreignKey: 'store_id', otherKey: 'book_id' });
Book.belongsToMany(Store, { through: StoreBook, foreignKey: 'book_id', otherKey: 'store_id' });



const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync Database (Auto Migrate)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized and auto-migrated.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { initDatabase, sequelize };
