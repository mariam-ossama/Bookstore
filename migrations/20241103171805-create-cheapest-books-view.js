'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW CheapestBooksByAuthor AS
      SELECT 
          b.id AS book_id,
          b.name AS book_name,
          a.id AS author_id,
          a.name AS author_name,
          sb.price AS min_price
      FROM 
          Books b
      JOIN 
          Authors a ON b.author_id = a.id
      JOIN 
          StoreBooks sb ON b.id = sb.book_id
      WHERE 
          sb.price = (
              SELECT MIN(price)
              FROM StoreBooks
              WHERE book_id = b.id
          )
      AND sb.price = (
          SELECT MIN(sb2.price)
          FROM StoreBooks sb2
          JOIN Books b2 ON sb2.book_id = b2.id
          WHERE b2.author_id = a.id
      )
      ORDER BY a.id;  -- Optionally order by author ID
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS CheapestBooksByAuthor;');
  }
};
