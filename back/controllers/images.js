const imagesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const Image = require('../models/image')
const User = require('../models/user')

imagesRouter.get('/', async (req, res) => {
    const images = await Image
        .find({})
        .populate('Band')
    res.json(images)
})

imagesRouter.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id)
        res.json(image)
    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})


imagesRouter.post('/', async (req, res) => {
    const { url, imageType, height, width, animated, deleteHash, size, type, bandId } = req.body

    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        const band = await Band.findById(bandId)

        const image = new Image({ url, imageType, height, width, animated, deleteHash, size, type, band: band._id, user: user._id })
        const result = await image.save()
        result.user = user
        result.band = band
        if (type === 'background') {
            band.backgroundImage = image._id
        }
        if (type === 'avatar') {
            band.avatar = image._id
        }
        if (type === 'gallery') {
            band.gallery = band.gallery.concat(image._id)
        }
        user.images = user.images.concat(image._id)
        await band.save()
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

module.exports = imagesRouter