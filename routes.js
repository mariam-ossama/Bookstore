// route.js
const express = require('express');
const router = express.Router();


const { sequelize } = require('./config/databaseConfig'); 

const Store = require('./bookStoreModels/store')(sequelize);
const Author = require('./bookStoreModels/author')(sequelize); // Initialize model
const Book = require('./bookStoreModels/book')(sequelize);
const StoreBook = require('./bookStoreModels/storeBook')(sequelize);
//const { Sequelize } = require('sequelize');

/**
 * @swagger
 * /start:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: Returns a greeting message
 */
router.get('/start', (req, res) => {
  res.send('Hello, World!');
});

// 1- Create an author
/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create an author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Bad request
 */
router.post('/authors', async (req, res) => {
  try {
    const { name } = req.body;
    const author = await Author.create({ name });
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2- Create a book for an author
/**
 * @swagger
 * /authors/{authorId}/books:
 *   post:
 *     summary: Create a book for an author
 *     parameters:
 *       - name: authorId
 *         in: path
 *         required: true
 *         description: The ID of the author
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               pages:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created successfully
 *       404:
 *         description: Author not found
 *       400:
 *         description: Bad request
 */
router.post('/authors/:authorId/books', async (req, res) => {
  try {
    const { authorId } = req.params;
    const { name, pages } = req.body;

    const author = await Author.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const book = await Book.create({ name, pages, author_id: authorId });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3- Create a new store
/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Name and address are required
 *       500:
 *         description: Internal server error
 */
router.post('/stores', async (req, res) => {
  try {
    const { name, address } = req.body;

    // Validate input
    if (!name || !address) {
      return res.status(400).json({ error: 'Name and address are required' });
    }

    const store = await Store.create({ name, address });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4- Add a specific book to a specific store
/**
 * @swagger
 * /stores/{storeId}/books/{bookId}:
 *   post:
 *     summary: Add a specific book to a specific store
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: The ID of the store
 *         schema:
 *           type: string
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: The ID of the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book added to store successfully
 *       404:
 *         description: Store or book not found
 *       400:
 *         description: Price is required
 *       500:
 *         description: Internal server error
 */
router.post('/stores/:storeId/books/:bookId', async (req, res) => {
  try {
    const { storeId, bookId } = req.params;
    const { price } = req.body;

    // Validate input
    if (!price) {
      return res.status(400).json({ error: 'Price is required' });
    }

    // Check if the store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if the book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Create the association
    const storeBook = await StoreBook.create({ store_id: storeId, book_id: bookId, price });
    res.status(201).json(storeBook);
  } catch (error) {
    console.error('Error fetching books for store:', error); // Existing log
    console.error('Detailed error:', error.message); // Additional log
    res.status(500).json({ error: 'An error occurred while fetching the books.' });
  }
});

// Endpoint to get all books in a specific store
/**
 * @swagger
 * /stores/{storeId}/books:
 *   get:
 *     summary: Get all books in a specific store
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: The ID of the store
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books in the store
 *       404:
 *         description: No books found for this store
 *       500:
 *         description: Internal server error
 */
const { Op } = require('sequelize');

router.get('/stores/:storeId/books', async (req, res) => {
  const { storeId } = req.params;

  try {
    // Step 1: Find all book ids associated with the specified storeId in StoreBook
    const storeBooks = await StoreBook.findAll({
      where: { store_id: storeId },
      attributes: ['book_id', 'price'], // Include book_id and price from StoreBook
    });

    if (storeBooks.length === 0) {
      return res.status(404).json({ message: 'No books found for this store.' });
    }

    // Step 2: Extract book ids and map prices to the book ids
    const bookIds = storeBooks.map((entry) => entry.book_id);
    const bookPrices = storeBooks.reduce((acc, entry) => {
      acc[entry.book_id] = entry.price;
      return acc;
    }, {});

    // Step 3: Find books with the extracted book ids
    const books = await Book.findAll({
      where: {
        id: { [Op.in]: bookIds },
      },
      attributes: ['id', 'name'], // Only include id and name from Book
    });

    // Step 4: Map books with their prices
    const result = books.map((book) => ({
      id: book.id,
      name: book.name,
      price: bookPrices[book.id],
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching books for store:', error);
    res.status(500).json({ error: 'An error occurred while fetching the books.' });
  }
});

/**
 * @swagger
 * /authors/{authorId}/books:
 *   get:
 *     summary: Get all books by a specific author
 *     parameters:
 *       - name: authorId
 *         in: path
 *         required: true
 *         description: The ID of the author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books by the author
 *       404:
 *         description: No books found for this author
 *       500:
 *         description: Internal server error
 */

router.get('/authors/:authorId/books', async (req, res) => {
  const { authorId } = req.params;

  try {
    // Step 1: Find all books with the specified author_id
    const books = await Book.findAll({
      where: { author_id: authorId },
      attributes: ['id', 'name', 'pages'], // Include only necessary fields
    });

    // Step 2: Check if any books were found for this author
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found for this author.' });
    }

    // Step 3: Format the response with book details
    const formattedResponse = books.map(book => ({
      id: book.id,
      name: book.name,
      pages: book.pages,
    }));

    // Send the formatted response
    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error fetching books for author:', error);
    res.status(500).json({ error: 'An error occurred while fetching the books.' });
  }
});


/**
 * @swagger
 * /cheapest-books-by-author:
 *   get:
 *     summary: Get cheapest books by author
 *     responses:
 *       200:
 *         description: List of cheapest books by author
 *       404:
 *         description: No books found
 *       500:
 *         description: Internal server error
 */
router.get('/cheapest-books-by-author', async (req, res) => {
  try {
    // Adjusting the query to use the correct column name
    const cheapestBooks = await sequelize.query(`
      SELECT b.book_id, b.book_name, a.id AS author_id, a.name AS author_name, b.min_price
      FROM CheapestBooksByAuthor b
      JOIN Authors a ON b.author_id = a.id
      WHERE b.min_price IN (
          SELECT MIN(min_price)
          FROM CheapestBooksByAuthor
          GROUP BY author_id
      )
      ORDER BY a.id;  -- Adjusting for correct author ID
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    if (cheapestBooks.length === 0) {
      return res.status(404).json({ message: 'No books found.' });
    }

    res.status(200).json(cheapestBooks);
  } catch (error) {
    console.error('Error fetching cheapest books by author:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cheapest books.' });
  }
});

module.exports = router;
