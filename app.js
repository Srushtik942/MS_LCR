const express = require('express');
const app = express();
const {createUser, fetchBook,saveBookToCollection,addTags,searchByTag} = require('./controllers/userController');
app.use(express.json());

app.post('/api/users',createUser);
app.get('/api/books/search',fetchBook);
app.post('/api/books/save',saveBookToCollection);
app.post('/api/books/tag',addTags);
app.get('/api/books/searchByTag',searchByTag);

module.exports = app;