const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://nodejsguide:nodejsguide@cluster0-xc044.mongodb.net/shop';

// Routes
const feedRoutes = require('./routes/feed');

// Parser for POST text data
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE", "OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
})

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  status = error.statusCode || 500;
  message = error.message;
  res.status(status).json({message: message});
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
.then( result => {
  app.listen(8080);
});