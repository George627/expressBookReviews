const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.filter((user) => {
        return user.username === username
    });

    if(user.length === 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let user = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    if(user.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Problem with the provided username and/or password."});
  }

  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).send("User logged in!")
  
  } else {
    
    return res.status(208).json({message: "Unable to log in. "});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.body.username;
  const review = req.body.review;

  const authorizedUser = req.session.authorization.username;
    
  let book = books[isbn];
  
  book.review = review;
  
  if(authorizedUser === username){
    
    books[isbn] = book;

    return res.status(200).json({message: "Review has been updated."});
  
} else {
    books.push(book);
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.body.username;
  
    const authorizedUser = req.session.authorization.username;
    
    if(authorizedUser === username){
      delete books[isbn];
      return res.status(200).json({message: "Review has been deleted."});
    
  } else {
        return res.status(300).json({message: "Please log in."});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
