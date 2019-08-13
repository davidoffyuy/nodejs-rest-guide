const path = require('path');
const rootDir = require('../util/path');
const deleteFile = require('../util/file').deleteFile;

const { validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  console.log('getPosts');
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.find().countDocuments()
  .then(count => {
    totalItems = count;
    return Post.find().skip((currentPage - 1) * perPage).limit(perPage);
  })
  .then(posts => {
    res.status(200).json({message: 'Posts successfully found',
      posts: posts, 
      totalItems: totalItems
    });
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

  let creator;

  if (!req.file) {
    const error = Error('Invalid Image File');
    error.statusCode = 422;
    throw error;
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  post.save()
  .then(result => {
    return User.findById(req.userId);
  })
  .then(user => {
    if (!user) {
      const error = new Error('User Not Found!');
      throw error;
    }
    creator = user;
    user.posts.push(post);
    return creator.save();
  })
  .then(result => {
    res.status(201).json({status: "success",
      message: "Post successfully created",
      post: post,
      creator: {_id: creator._id, name: creator.name}
    });
  })
  .catch(err => {
    next(err);
  });
}

exports.editPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input Values!');
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }

    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;      
    }
    
    if (!imageUrl) {
      const error = Error('Invalid Image File');
      error.statusCode = 422;
      throw error;   
    }

    console.log('imageUrl');
    console.log(imageUrl);
    console.log('post.imageUrl');
    console.log(post.imageUrl);
    if (imageUrl !== post.imageUrl) {
      deleteFile(path.join(rootDir, post.imageUrl));
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.imageUrl = imageUrl;
    return post.save()
  })
  .then(result => {
    res.status(200).json({status: "success",
      message: "Post successfully saved",
      post: result
    });
  })
  .catch(error => {
    next(error);
  })
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }
    // if Post owner does not match, throw error...

    deleteFile(path.join(rootDir, post.imageUrl));  
    return Post.findByIdAndDelete(postId);
  })
  .then(post => {
    res.status(200).json({message: "Post Deleted", post: post});
  })
  .catch(error => {
    next(error);
  })
}