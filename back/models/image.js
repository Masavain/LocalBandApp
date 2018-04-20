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
    album: {type: mongoose.Schema.Types.ObjectId, ref: 'Album'},
    band: { type: mongoose.Schema.Types.ObjectId, ref: 'Band' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
  })
  
  imageSchema.statics.format = (image) => {
    return {
        id: image._id,
        url: image.url,
        type: image.type,
        height: image.height,
        width: image.width,
        animated: image.animated,
        deletehash: image.deletehash,
        size: image.size,   
        type: image.type,
        album: image.album,
        band: image.band,
        user: image.user,
        post: image.post
    }
  }
  
  const Image = mongoose.model('Image', imageSchema)
  
  module.exports = Image