const bandsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const User = require('../models/user')
const Image = require('../models/image')
const bandcamp = require('bandcamp-scraper')
const Concert = require('../models/concert')

bandsRouter.get('/', async (req, res) => {
    const bands = await Band
        .find({})
        .populate('user', { username: 1, name: 1 })
        .populate('backgroundImage', { url: 1 })
        .populate('avatar', { url:1 })
        .populate('gallery', { url: 1})
        .populate('albums')
        .populate({ 
            path: 'albums',
            populate: {
              path: 'albumArt',
              model: 'Image'
            }
         })
        .populate('concerts')
    res.json(bands)
})

bandsRouter.post('/', async (req, res) => {
    const { name, genre, started, hometown, about, active } = req.body

    try {
        if (!name || !genre || !hometown) {
            return res.status(400).json({ error: 'content missing' })
        }
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        var genres = []
        if(genre.trim() != ''){
            genres = genre.split(',');
        }
        console.log(genres)
        const band = new Band({ name, genre: genres, started, hometown, about: (about || ''), instagramPostURL: '', bcURL: '', bcAlbumID: '',bcTrackID: '', active: true, user: user._id, concerts: [] })
        const result = await band.save()
        result.user = user

        user.bands = user.bands.concat(band._id)
        await user.save()
        res.status(201).json(result)

    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            res.status(401).json({ error: exception.message })
        } else {
            res.status(500).json({ error: 'something went wrong...' })
        }
    }

})

bandsRouter.put('/:id', async (req, res) => {
    try {
        const { about, genre, newGenre, started, facebookURL, instagramUsername, instagramPostURL, genreClear } = req.body
        const vanha = await Band.findById(req.params.id)
        console.log('backissä',genre)

        var genres = []
        if (newGenre) {
            console.log('backissä',newGenre)
            if(newGenre.trim() != ''){
                genres = newGenre.split(',');
            }

        }
        var newGenres = genre.concat(genres)
        if (genreClear) newGenres = []
        const uusi = { about: about ? about : vanha.about,
            genre: newGenres ? newGenres : vanha.genre,
            started: started ? started : vanha.started ,
            facebookURL: facebookURL ? facebookURL : vanha.facebookURL,
            instagramUsername: instagramUsername 
            ? instagramUsername : vanha.instagramUsername,
            instagramPostURL: instagramPostURL ? instagramPostURL.toString() : vanha.instagramPostURL}
        const updated = await Band.findByIdAndUpdate(req.params.id, uusi, { new: true }).populate('user')
        res.status(200).json(Band.format(updated))

    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
})

bandsRouter.get('/:id', async (req, res) => {
    try {
        const band = await Band.findById(req.params.id)
        .populate('backgroundImage')
        .populate('user').populate('albums').populate('concerts')
        if (band) {
            res.json(Band.format(band))
          } else {
            res.status(404).end()
          }

    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
})


bandsRouter.post('/:id/bandcamp', async (req, res) => {
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

        const uusi = {
            bcURL: url,
            bcAlbumID: bandcampInfo.raw.current.id,
            bcTrackID: bandcampInfo.raw.current.featured_track_id
        }
        const updatedBand = await Band.findByIdAndUpdate(req.params.id, uusi, { new: true }).populate('user').populate('concerts')
        console.log('updated', updatedBand)
        res.status(200).json(Band.format(updatedBand))
    } catch (exception) {
        res.status(400).json({ error: 'malformatted id' })
    }
})

bandsRouter.post("/:id/youtube", async (req, res) => {
    try {

        const uusi = { youtubeID: req.body.youtubeID }
        console.log('routerissa uusi: ', uusi)
        const updated = await Band.findByIdAndUpdate(req.params.id, uusi, { new: true }).populate('user').populate('concerts')
        console.log('routerissa updated: ', updated)
        res.json(Band.format(updated))

    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
  })

  bandsRouter.delete('/:id', async (req, res) => {
      try{
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        const result = await Band.findByIdAndRemove(req.params.id)
        user.bands = user.bands.filter(b => b._id !== result._id)
        await user.save()
        res.status(204).end()
        
      } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
      }
    
  })

module.exports = bandsRouter