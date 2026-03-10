const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists!",
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login",
  });
});

// Task 1: Get all books
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Task 3: Get books by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const matches = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author) {
      matches[isbn] = books[isbn];
    }
  });

  return res.status(200).json(matches);
});

// Task 4: Get books by title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const matches = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      matches[isbn] = books[isbn];
    }
  });

  return res.status(200).json(matches);
});

// Task 5: Get reviews by ISBN
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

// Task 10: Get all books using async/await + Axios
public_users.get("/async/books", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books asynchronously",
    });
  }
});

// Task 11: Get book by ISBN using Promise + Axios
public_users.get("/async/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch(() => {
      return res.status(500).json({
        message: "Error fetching book by ISBN asynchronously",
      });
    });
});

// Task 12: Get books by author using async/await + Axios
public_users.get("/async/author/:author", async function (req, res) {
  const { author } = req.params;

  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author asynchronously",
    });
  }
});

// Task 13: Get books by title using async/await + Axios
public_users.get("/async/title/:title", async function (req, res) {
  const { title } = req.params;

  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by title asynchronously",
    });
  }
});

module.exports.general = public_users;