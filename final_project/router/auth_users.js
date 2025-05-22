const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "deltaman", password: "delta"}];
const SECRET_KEY = "I-Dont-Know"

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(' ')[1]; 

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: '1h'} )

  return res.status(200).json({ message: 'Login successful', token });

});

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const {review} = req.body;
  const {isbn} = req.params;
  const username = req.user.username;

  if(!review)
  {
    return res.status(400).json({message: `Please provide a review`})
  }

  if(!isbn)
  {
    return res.status(400).json({message: `Please provide a isbn`})
  }

  let selectedBook = Object.values(books).find((book) => book.isbn === isbn);

  if (!selectedBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!selectedBook.reviews) {
    selectedBook.reviews = {};
  }

  selectedBook.reviews[username] = review;

  return res.status(200).json({message: `Reached this point ${username} ${isbn}`})
})

regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const {isbn} = req.params;
  const username = req.user.username;

  const selectedBook = Object.values(books).find((book) => book.isbn === isbn);

  if(!selectedBook)
  {
    return res.status(404).json({ message: "Book not found" });
  }

  if(!selectedBook.reviews || !selectedBook.reviews[username])
  {
    return res.status(404).json({ message: `No review found for this user ${JSON.stringify(selectedBook)}` });
  }

  delete selectedBook.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
