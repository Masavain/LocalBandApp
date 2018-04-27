const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  role: String,
  bands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Band' }],
  favBands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Band' }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

userSchema.statics.format = (user) => {
  return {
    username: user.username,
    name: user.name,
    id: user.id,
    bands: user.bands,
    images: user.images,
    role: user.role,
    favBands: user.favBands
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User