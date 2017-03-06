var Pusher = require('pusher');
var Post  = require('./models/post');
var express = require('express');
var router = express.Router();

var pusher = new Pusher({
  appId: '296195',
  key: '8dfa4a5831cd9c0be510',
  secret: 'e862904922c335204b8a',
  encrypted: true
});
var channel = 'project_posts';

//Post writing/revision
router.post('/post', function (req, res) {
  Post.create({
    accessCode: req.body.accessCode,
    username: req.body.username,
    content: req.body.content,
    prevContent: req.body.prevContent,
    editedFrom: req.body.editedFrom,
    comments: [ { username: req.body.username, comment: req.body.comment, insertedAt: new Date() } ],
    insertedAt: new Date()
  }, function (err, post) {
    if (err) {
      console.log('CREATE Error: ' + err);
        res.status(500).send('Error');
    } else {
      pusher.trigger(
        channel,
        'new_post', 
        {
          _id: post._id,
          accessCode: post.accessCode,
          username: post.username,
          date: post.insertedAt,
          content: post.content,
          prevContent: post.prevContent,
          editedFrom: post.editedFrom,
          comments: post.comments
        }
      );
    }
    res.status(200).json(post);
  });
});

//Post a comment
router.post('/post/:_id/comment', function(req, res){
  var newComment = {
    username: req.body.username,
    comment: req.body.comment,
    insertedAt: new Date()
  };
  Post.findOneAndUpdate(
    { _id: req.params._id },
    { $push: { comments: newComment } },
    { safe: true, upsert: true, new: true },
    function(err, post){
      if (err) {
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      } else {
        pusher.trigger(
          channel,
          'new_comment', 
          {
            _id: post._id,
            comments: post.comments
          }
        );
      }
      res.json(post);
  });  
});

//Get request for all posts with same access code
router.get('/posts/:accessCode', function (req, res) {
  Post.find({ accessCode: req.params.accessCode}).sort({ insertedAt: 'ascending'}).exec(function(err, posts){
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.json(posts);
  });
});

//Get request for the latest post with the same access code
router.get('/posts/latest/:accessCode', function (req, res) {
  Post.find({ accessCode: req.params.accessCode}, function(err, posts){
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.json(posts[posts.length-1]);
  });
});

//Get request for a specific post
router.get('/post/:id', function (req, res) {
  Post.find({ _id: req.params.id}, function(err, post){
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.json(post);
  });
});

module.exports = router;