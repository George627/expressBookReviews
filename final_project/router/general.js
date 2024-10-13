const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){

    if(isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User has been registered."});
    } else {
         return res.status(404).json({message: "User is already in the system."});
    }

  }

  return res.status(400).json({message: "Unable to register new user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify( books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  author = author.replace("_", " ");
  const bookValues = Object.values(books);
  bookValues.forEach(ele => {
    if(ele.author === author){
        return res.send(ele);
    }
  });

  return res.status(300).json({message: "No Match for Author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  console.log(title);
  title = title.replaceAll("_", " ");
  console.log(title);
  const bookValues = Object.values(books);
  bookValues.forEach(ele => {
    if(ele.title === title){
        return res.send(ele);
    }
  });

  return res.status(300).json({message: "No Match for Title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(books[isbn]);
});

module.exports.general = public_users;
