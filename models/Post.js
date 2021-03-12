const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
})

const post = mongoose.model('Post', postSchema)
module.exports = post;
