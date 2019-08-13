const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://nodejsguide:nodejsguide@cluster0-xc044.mongodb.net/shop';
const isAuth = require('./middleware/is-auth');

// Routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// Setup Multer configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Parser for POST text data
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE", "OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
})

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data});
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
.then( result => {
  app.listen(8080);
});