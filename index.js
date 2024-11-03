// index.js
const express = require('express');
const { initDatabase } = require('./config/databaseConfig'); // Import the database connection
const routes = require('./routes'); // Import routes from route.js
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the version of OpenAPI
    info: {
      title: 'Bookstore API',
      version: '1.0.0',
      description: 'API documentation for the Bookstore application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json()); // Middleware to parse JSON requests
app.use('/', routes); // Use routes from route.js

// Initialize the database and start the server
initDatabase()
  .then(() => {
    console.log('Database initialized.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing the database:', error);
  });
