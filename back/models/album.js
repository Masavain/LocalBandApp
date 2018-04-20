const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
  name: String,
  year: Number,
  about: String,
  bcURL: String,
  bcAlbumID: String,
  bcTrackID: String,
  albumArt: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  band: { type: mongoose.Schema.Types.ObjectId, ref: 'Band' }
})

albumSchema.statics.format = (album) => {
  return {
    id: album._id,
    name: album.name,
    year: album.year,
    about: album.about,
    bcURL: album.bcURL,
    bcAlbumID: album.bcAlbumID,
    bcTrackID: album.bcTrackID,
    albumArt: album.albumArt,
    band: album.band
  }
}

const Album = mongoose.model('Album', albumSchema)

module.exports = Album