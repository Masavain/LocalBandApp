const bandsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const User = require('../models/user')
const bandcamp = require('bandcamp-scraper')

bandsRouter.get('/', async (req, res) => {
    const bands = await Band
        .find({})
        .populate('user', { username: 1, name: 1 })

    res.json(bands)
})

bandsRouter.post('/', async (req, res) => {
    const { name, genre, started, hometown, about, active } = req.body

    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)

        const band = new Band({ name, genre, started, hometown, about: (about || ''), bcURL: '', bcAlbumID: '',bcTrackID: '', active: true, user: user._id })
        const result = await band.save()
        result.user = user

        user.bands = user.bands.concat(band._id)
        await user.save()
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

bandsRouter.post('/:id/bandcamp', async (req, res) => {
    try {
        const body = req.body
        const url = body.albumUrl
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
        console.log('album:', uusi.bcAlbumID, 'track:', uusi.bcTrackID)
        const updatedBand = await Band.findByIdAndUpdate(req.params.id, uusi, { new: true }).populate('user')
        console.log('updated', updatedBand)
        res.status(200).json(Band.format(updatedBand))
    } catch (exception) {
        console.log(exception)
        res.status(400).json({ error: 'malformatted id' })
    }

})



bandsRouter.put('/:id', async (request, response) => {
    try {
        const vanha = await Band.findById(request.params.id)
        const uusi = { ...vanha, about: request.body.about }
        console.log(vanha, uusi)
        const updated = await Band.findByIdAndUpdate(request.params.id, uusi, { new: true }).populate('user')
        response.json(Band.format(updated))

    } catch (exception) {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    }
})


module.exports = bandsRouter