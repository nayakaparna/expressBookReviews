const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const exists = users.filter((user) => user.username === username);
    if (exists.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filtered_books = Object.values(books).filter(book => book.author === author);
  res.status(200).json(filtered_books);
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filtered_books = Object.values(books).filter(book => book.title === title);
  res.status(200).json(filtered_books);
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

/* --- ASYNC/AWAIT PROMISE IMPLEMENTATIONS (Tasks 10-13) --- */

// Task 10: Get all books using Async/Await
public_users.get('/server/asynclist', async (req, res) => {
  try {
    const getBooks = () => Promise.resolve(books);
    const result = await getBooks();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Task 11: Get book details by ISBN using Promises
public_users.get('/server/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Get book details by Author using Async/Await
public_users.get('/server/author/:author', async (req, res) => {
  const author = req.params.author;
  const getByAuthor = () => {
    return new Promise((resolve) => {
      const filtered = Object.values(books).filter(b => b.author === author);
      resolve(filtered);
    });
  };
  const result = await getByAuthor();
  res.status(200).json(result);
});

// Task 13: Get book details by Title using Async/Await
public_users.get('/server/title/:title', async (req, res) => {
  const title = req.params.title;
  const getByTitle = () => {
    return new Promise((resolve) => {
      const filtered = Object.values(books).filter(b => b.title === title);
      resolve(filtered);
    });
  };
  const result = await getByTitle();
  res.status(200).json(result);
});

module.exports.general = public_users;