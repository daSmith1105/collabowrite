var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var postSchema = new Schema({  
  accessCode: { type: String },
  username:    { type: String },
  content: { type: String },
  notes: {type: String },
  insertedAt:  { type: Date }
});

module.exports = mongoose.model('Post', postSchema); 