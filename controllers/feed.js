const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  console.log("getposts");
  res.status(200).json({posts: [
    {
      _id: "testId",
      title: "Test Title", 
      content: "Test Content",
      imageUrl: "images/book1.jpg",
      creator: {
        name: "David"
      },
      createdAt: new Date()
    }
  ]});
}

exports.createPost = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const content = req.body.content
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input Values!');
    error.statusCode = 422;
    throw error;
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/book1.jpg',
    creator: {name: "David"},
  });
  post.save()
  .then(result => {
    res.status(201).json({status: "success",
      message: "Post successfully created",
      post: result
    });
  })
  .catch(err => {
    next(err);
  });
}