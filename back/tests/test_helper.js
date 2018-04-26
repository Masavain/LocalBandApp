const Band = require('../models/band')
const User = require('../models/user')
const Album = require('../models/album')

const initialBands = [
    {
        name: 'testbandalskdjalsdkjas',
        genre: 'pop',
        hometown: 'Helsinki',
        started: 2017,
        about: 'asdasd'
    },
    {
        name: 'testband2',
        genre: 'rock',
        hometown: 'Helsinki',
        started: 2015,
        about: ''
    },
    {
        name: 'testband3',
        genre: 'punk',
        hometown: 'Tampere',
        started: 2018,
        about: ''
    }
]

const initialAlbums = [
    {
        name: 'testalbum',
        year: 2000,
        about: 'nothing here',
    },
    {
        name: 'testalbum2',
        year: 2001,
        about: 'nothing here either',
    },
]

const format = (band) => {
    return {
        name: band.name,
        genre: band.genre,
        hometown: band.hometown,
        started: band.started,
        about: band.about,
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
const albumsInDb = async () => {
    const albums = await Album.find({})
    return albums
}
module.exports = {
    initialBands, format, nonExistingId, bandsInDb, usersInDb, albumsInDb, initialAlbums
}