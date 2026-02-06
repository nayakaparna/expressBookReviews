const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.get('/', async function (req, res) {
  try {
    // We make an asynchronous call to the books endpoint
    // Replace 5000 with your actual port if different
    const response = await axios.get("http://localhost:5000/");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        // Simulating an asynchronous fetch using Axios
        // Replace 5000 with your server's port
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Error: Book not found", error: error.message });
    }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Step 1: Create a Promise to handle the search logic
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let filteredBooks = [];

    bookKeys.forEach((key) => {
      if (books[key].author === author) {
        filteredBooks.push({ isbn: key, ...books[key] });
      }
    });

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found by this author");
    }
  });

  // Step 2: Consume the Promise
  getBooksByAuthor
    .then((bookList) => {
      res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted friends datanpm insyall
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book exists in the 'books' object
  if (books[isbn]) {
    // Return the book details formatted neatly
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    // Return a 404 error if the ISBN isn't found
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books); // Get all ISBNs/keys
  let filteredBooks = [];

  // Iterate through the books object
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      // Add the book to the list, including its ISBN as a property
      filteredBooks.push({
        isbn: key,
        ...books[key]
      });
    }
  });

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  let filteredBooks = [];

  // Iterate through the books object to find titles that match
  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      filteredBooks.push({
        isbn: key,
        ...books[key]
      });
    }
  });

  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Extract the ISBN from the URL path
  const isbn = req.params.isbn;

  // Access the book by ISBN
  const book = books[isbn];

  if (book) {
    // Return only the reviews object of that book
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    // Handle the case where the ISBN doesn't exist
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
