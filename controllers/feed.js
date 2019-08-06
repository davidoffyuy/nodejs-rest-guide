const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
  .then(posts => {
    res.status(200).json({message: 'Posts successfully found', posts: posts});
  })
  .catch(error => {
    next(error);
  })
}

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
  .then( post => {
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }
    else {
      res.status(200).json({message: 'Post fetch successful', post: post});
    }
  })
  .catch(err => {
    next(err);
  })
}


exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input Values!');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  if (!req.file) {
    const error = Error('Invalid Image File');
    error.statusCode = 422;
    throw error;
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
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