const mongoose = require('mongoose')

const concertSchema = new mongoose.Schema({
  name: String,
  date: String,
  about: String,
  place: String,
  fbURL: String,
  band: { type: mongoose.Schema.Types.ObjectId, ref: 'Band' }
})

concertSchema.statics.format = (concert) => {
  return {
    id: concert._id,
    name: concert.name,
    date: concert.date,
    about: concert.about,
    place: concert.place,
    fbURL: concert.fbURL,
    band: concert.band
  
  }
}

const Concert = mongoose.model('Concert', concertSchema)

module.exports = Concert