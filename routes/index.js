var express = require("express");
var router = express.Router();

//Get homepage
router.get("/", function (req, res) {
  res.render('index', { pusher_app_key : '8dfa4a5831cd9c0be510' });
});

module.exports = router;