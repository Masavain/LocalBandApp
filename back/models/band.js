const mongoose = require('mongoose')

const bandSchema = new mongoose.Schema({
  name: String,
  about: String,
  started: Number,
  active: Boolean,
  genre: [String],
  hometown: String,
  bcURL: String,
  bcAlbumID: String,
  bcTrackID: String,
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  backgroundImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  youtubeID: String,
  facebookURL: String,
  instagramUsername: String,
  instagramPostURL: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  concerts: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert' }
})

bandSchema.statics.format = (band) => {
  return {
    name: band.name,
    about: band.about,
    genre: band.genre,
    user: band.user,
    hometown: band.hometown,
    id: band._id,
    bcURL: band.bcURL,
    bcAlbumID: band.bcAlbumID,
    bcTrackID: band.bcTrackID,
    avatar: band.avatar,
    gallery: band.gallery,
    backgroundImage: band.backgroundImage,
    albums: band.albums,
    youtubeID: band.youtubeID,
    facebookURL: band.facebookURL,
    instagramUsername: band.instagramUsername,
    instagramPostURL: band.instagramPostURL,
    concerts: band.concerts
  }
}

const Band = mongoose.model('Band', bandSchema)

module.exports = Band