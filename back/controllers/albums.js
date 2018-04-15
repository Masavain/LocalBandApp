const albumsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const User = require('../models/user')
const Image = require('../models/image')
const Album = require('../models/album')
const bandcamp = require('bandcamp-scraper')

albumsRouter.get('/', async (req, res) => {
    const albums = await Album
        .find({})
        .populate('band')
        .populate('albumArt')
    res.json(albums)
})

albumsRouter.post('/', async (req, res) => {
    const { name, year, about, bandId } = req.body
    console.log('täällä jee')
    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }

        const album = new Album({ name, year, about, bcURL: '', bcAlbumID: '',bcTrackID: '',  band: bandId })
        console.log('album', album)
        const result = await album.save()
        const band = await Band.findById(bandId)
        result.band = band

        band.albums = band.albums.concat(album._id)
        await band.save()
        res.status(201).json(result)

    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            res.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            res.status(500).json({ error: 'something went wrong...' })
        }
    }

})

albumsRouter.put('/:id', async (req, res) => {
    try {
        const { about, year, name } = req.body
        const vanha = await Album.findById(req.params.id)
        const uusi = { about: about ? about : vanha.about,
                        year: year ? year : vanha.year,
                        name: name ? name : vanha.name }
        const updated = await Album.findByIdAndUpdate(req.params.id, uusi, { new: true })
                                    .populate('band').populate('albumArt')
        res.json(Album.format(updated))

    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})

albumsRouter.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('albumArt').populate('band')
        res.json(Album.format(album))

    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})

albumsRouter.post('/:id/bandcamp', async (req, res) => {
    try {
        const body = req.body
        const url = `${body.albumUrl}`
        function promisify(url) {
            return new Promise(function (resolve, reject) {
                bandcamp.getAlbumInfo(url, async (error, albumInfo) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(albumInfo)
                    }
                })
            })
        }

        const bandcampInfo = await promisify(url)
        console.log(bandcampInfo)
        const uusi = {
            bcURL: url,
            bcAlbumID: bandcampInfo.raw.current.id,
            bcTrackID: bandcampInfo.raw.current.featured_track_id
        }
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, uusi, { new: true }).populate('band').populate('albumArt')
        console.log('updated', updatedAlbum)
        res.status(200).json(Album.format(updatedAlbum))
    } catch (exception) {
        console.log(exception)
        res.status(400).json({ error: 'malformatted id' })
    }
})

module.exports = albumsRouter