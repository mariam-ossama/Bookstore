# Bookstore
 Ovarc Backend Coding Challenge

# 1- Create mySQL Database nammed "bookstore"
# 2- Modify the .env variables for Database configuration
   # DB_NAME=bookstore
   # DB_USER=root
   # DB_PASSWORD=15_March_2002
   # DB_HOST=localhost
   # DB_PORT=3306
# 3- Open the terminal and run these 2 commands sequestially
   # npm install --> to install all the modules in package.js
   # node index.js

### How to run the endpoints
  # Create Author:(POST)
    http://localhost:3000/authors
    json body:
       {
           "name": "Mariam"
       }
  # Create Book For an Author: (POST)
    http://localhost:3000/authors/1/books --> where 1 is the author id
    json body: 
        {
             "name": "Mariam's book 3",
             "pages": 500
        }

  # Create a Store: (POST)
   http://localhost:3000/stores
   json body: 
       {
            "name": "My Bookstore 2",
            "address": "123 Book St, Literature City, newwwww"
       }
 #  Sell a book in a store for a certain price: (POST)
     http://localhost:3000/stores/2/books/4  --> where 2 is the store id and 4 is the book id
     json body:
       {
            "price": 10.11
       }
 #  Get all books in a certain store: (GET)
     http://localhost:3000/stores/2/books  --> where 2 is the store id

 #   Get all books written by a certain author: (GET)
     http://localhost:3000/authors/2/books --> where 2 is the author id

 #   Get the cheapest book available for each author in any store: (GET)
      http://localhost:3000/cheapest-books-by-author
     