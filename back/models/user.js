const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  bands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Band' }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
})

userSchema.statics.format = (user) => {
  return {
    username: user.username,
    name: user.name,
    id: user.id,
    bands: user.bands,
    images: user.images
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User