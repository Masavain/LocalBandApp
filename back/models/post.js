const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  author: String,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

postSchema.statics.format = (post) => {
  return {
    title: post.title,
    content: post.content,
    date: post.date,
    images: post.images,
    author: post.author,
    user: post.user
  }
}

const Post = mongoose.model('Post', postSchema)

module.exports = Post