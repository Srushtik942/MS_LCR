const express = require('express');
const app = express();
const {createUser, fetchBook,saveBookToCollection} = require('./controllers/userController');
app.use(express.json());

app.post('/api/users',createUser);
app.get('/api/books/search',fetchBook);
app.post('/api/books/save',saveBookToCollection);

module.exports = app;