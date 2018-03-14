const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  bands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Band' }]
})

userSchema.statics.format = (user) => {
  return {
    username: user.username,
    name: user.name,
    id: user.id,
    bands: user.bands
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User