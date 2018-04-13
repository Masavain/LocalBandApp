const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    url: String,
    imageType: String,
    height: Number,
    width: Number,
    animated: Boolean,
    deleteHash: String,
    size: Number,
    type: String,
    band: { type: mongoose.Schema.Types.ObjectId, ref: 'Band' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  })
  
  imageSchema.statics.format = (image) => {
    return {
        url: image.url,
        type: image.type,
        height: image.height,
        width: image.width,
        animated: image.animated,
        deletehash: image.deletehash,
        size: image.size,   
        type: image.type,
        band: image.band,
        user: image.user
    }
  }
  
  const Image = mongoose.model('Image', imageSchema)
  
  module.exports = Image