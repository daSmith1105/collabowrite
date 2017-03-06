var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var postSchema = new Schema({  
  accessCode: { type: String },
  username:    { type: String },
  content: { type: String },
  prevContent: { type: String },
  editedFrom: {type: Number },
  comments: {type: Array },
  insertedAt:  { type: Date }
});

module.exports = mongoose.model('Post', postSchema); 