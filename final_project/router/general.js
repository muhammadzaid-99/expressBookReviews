const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const data = req.body;
  console.log(users);

  const checkUniqueUser = new Promise((resolve, reject) => {
    users.forEach(element => {
      if (data.username == element.username) {
        reject({ message: "Customer already exists!" });
      }
    });
    resolve();
  });

  checkUniqueUser
    .then(() => {
      if (!data.username || !data.password) {
        return res.status(400).json({ message: "Please provide both username and password!" });
      } else {
        const user = { username: data.username, password: data.password };
        users.push(user);
        return res.status(200).json({ message: "Customer registered successfully!" });
      }
    })
    .catch(error => {
      return res.status(400).json(error);
    });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // console.log(JSON.stringify(books))
  return res.status(300).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return res.status(300).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const booksByAuthor = {}

  for (b in books) {
    if (books[b].author == author)
      booksByAuthor[b] = books[b];
  }
  console.log(booksByAuthor);

  return res.status(300).json({ booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const booksByTitle = {}

  for (b in books) {
    if (books[b].title == title)
      booksByTitle[b] = books[b];
  }
  console.log(booksByTitle);

  return res.status(300).json({ booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return res.status(300).json(books[isbn].reviews);
});

/*
ASYNC AWAIT / PROMISE 

public_users.get('/', async function (req, res) {
  try {
    // Assuming books is available globally or in the current scope
    if (books) {
      return res.status(200).json({ books });
    } else {
      throw new Error("Unable to retrieve book list");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books && books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found for the given ISBN" });
    }
  });

  getBookByISBN
    .then((bookDetails) => {
      return res.status(200).json(bookDetails);
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const booksByAuthor = {};

    for (const b in books) {
      if (books[b].author === author) {
        booksByAuthor[b] = books[b];
      }
    }

    if (Object.keys(booksByAuthor).length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ message: "No books found for the given author" });
    }
  });

  getBooksByAuthor
    .then((booksByAuthor) => {
      return res.status(200).json({ booksByAuthor });
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const getBooksByTitle = new Promise((resolve, reject) => {
    const booksByTitle = {};

    for (const b in books) {
      if (books[b].title === title) {
        booksByTitle[b] = books[b];
      }
    }

    if (Object.keys(booksByTitle).length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ message: "No books found for the given title" });
    }
  });

  getBooksByTitle
    .then((booksByTitle) => {
      return res.status(200).json({ booksByTitle });
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
});

*/

module.exports.general = public_users;
