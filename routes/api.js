var Pusher = require('pusher');
var Post  = require('../models/post');
var express = require('express');
var router = express.Router();

var pusher = new Pusher({
  appId      : process.env.PUSHER_APP_ID,
  key        : process.env.PUSHER_APP_KEY,
  secret     : process.env.PUSHER_APP_SECRET,
  encrypted  : true,
});
var channel = 'events_to_be_shown';

router.post('/post', function (req, res) {
  Post.create({
    accessCode: req.body.accessCode,
    username: req.body.username,
    content: req.body.content,
    notes: req.body.notes,
    insertedAt: new Date(),
  }, function (err, post) {
    if (err) {
      console.log('CREATE Error: ' + err);
        res.status(500).send('Error');
    } else {
      pusher.trigger(
        channel,
        'newPosts', 
        {
          accessCode: post.accessCode,
          username: post.username,
          date: post.insertedAt,
          content: post.content,
          notes: post.notes
        }
      );
    }
    res.status(200).json(post);
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
  Post.find({ _id: req.params.id}, function(err, posts){
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.json(posts);
  });
});

module.exports = router;