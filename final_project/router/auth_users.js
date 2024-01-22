const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"zaid","password":"123"},{"username":"alh","password":"123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const data = req.body

  users.forEach(element => {
    if (data.username == element.username && data.password == element.password) {
      const j = jwt.sign({payload: data.username}, '123G');
      res.cookie('login', j, {maxAge: 1000 * 60 * 60})
      return res.status(300).json({message: "Login success!"});
    }
  });

  return res.status(300).json({message: "Invalid username or password!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const reviewPosted = req.body.review
  const isbn = req.params.isbn
  const username = jwt.decode(req.cookies.login).payload

  if(books[isbn]) {
    books[isbn].reviews[username] = {"review":reviewPosted}
  }
  
  console.log(books[isbn])
  return res.status(300).json({message: `Review posted or updated. Book ISBN: ${isbn}.`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = jwt.decode(req.cookies.login).payload

  if(books[isbn]) {
    delete books[isbn].reviews[username] 
  }
  
  console.log(books[isbn])
  return res.status(300).json({message: `Review deleted. Book ISBN: ${isbn}.`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
