const Band = require('../models/band')
const User = require('../models/user')

const initialBands = [
    {
        name: 'testband',
        genre: 'pop',
        hometown: 'Helsinki',
        started: 2017
    },
    {
        name: 'testband2',
        genre: 'rock',
        hometown: 'Helsinki',
        started: 2015
    },
    {
        name: 'testband3',
        genre: 'punk',
        hometown: 'Tampere',
        started: 2018
    }
]

const format = (band) => {
  return {
    name: band.name,
    genre: band.genre,
    hometown: band.hometown,
    started: band.started,
    id: band._id
  }
}

const nonExistingId = async () => {
  const band = new Band()
  await band.save()
  await band.remove()

  return band._id.toString()
}

const bandsInDb = async () => {
  const bands = await Band.find({})
  return bands.map(format)
}
const usersInDb = async () => {
    const users = await User.find({})
    return users
  }

module.exports = {
    initialBands, format, nonExistingId, bandsInDb, usersInDb
}