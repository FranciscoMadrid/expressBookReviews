const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  users.push({username, password});

  return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(400).json({ message: `ISBN is required in the URL parameter` });
  }

  let result = Object.values(books).filter((book) => book.isbn === isbn);

  if (result.length === 0) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
  }

  res.send({ result });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;

  if (!author) {
    return res.status(400).json({ message: `Author is required in the URL parameter` });
  }

  let result = Object.values(books).filter((book) => book.author === author);
  
  if (result.length === 0) {
    return res.status(404).json({ message: `No book found with Author ${author}` });
  }

  res.send({ result });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;

  if (!title) {
    return res.status(400).json({ message: `title is required in the URL parameter` });
  }

  let result = Object.values(books).filter((book) => book.title === title);
  
  if (result.length === 0) {
    return res.status(404).json({ message: `No book found with title ${title}` });
  }

  res.send({ result });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(400).json({ message: `ISBN is required in the URL parameter` });
  }

  let result = Object.values(books).find((book) => book.isbn === isbn);

  if (result.length === 0) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
  }

  res.send({ reviews: result.reviews });
});

module.exports.general = public_users;
