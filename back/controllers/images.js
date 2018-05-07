const imagesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const Image = require('../models/image')
const User = require('../models/user')
const Album = require('../models/album')
const Post = require('../models/post')

imagesRouter.get('/', async (req, res) => {
    const images = await Image
        .find({})
        .populate('band')
        .populate('album')
    res.json(images.map(Image.format))
})

imagesRouter.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id).populate('band').populate('album')
        if(image) {
            res.json(Image.format(image))
        } else {
            res.status(404).end()
        }
    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
})

imagesRouter.get('/:id/full', async (req, res) => {
    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const image = await Image.findById(req.params.id).populate('band').populate('album')
        if(image) {
            console.log('deco id', decodedToken.id.toString(), 'user', image.user.toString())
            if (image.user.toString() === decodedToken.id.toString()) {
                console.log('tääälllä!!')
                res.json(image)
            }
        } else {
            res.status(404).end()
        }
        
        
    } catch (exception) {
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

imagesRouter.post('/albumart', async (req, res) => {
    const { url, imageType, height, width, animated, deleteHash, size, type, albumId } = req.body

    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        const album = await Album.findById(albumId)

        const image = new Image({ url, imageType, height, width, animated, deleteHash, size, type, album:albumId , user: user._id })
        const result = await image.save()
        result.user = user
        result.album = album
        album.albumArt = image._id
        user.images = user.images.concat(image._id)
        await album.save()
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

imagesRouter.post('/postimage', async (req, res) => {
    const { url, imageType, height, width, animated, deleteHash, size, type, postId } = req.body

    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        const post = await Post.findById(postId)

        const image = new Image({ url, imageType, height, width, animated, deleteHash, size, type, post:postId , user: user._id })
        const result = await image.save()
        result.user = user
        result.post = post
        post.images = post.images.concat(image._id)
        user.images = user.images.concat(image._id)
        await post.save()
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

imagesRouter.delete('/:id', async (req, res) => {
    try{
      const token = req.token
      const decodedToken = jwt.verify(token, process.env.SECRET)
      console.log('decoded', decodedToken)

      if (!token || !decodedToken.id) {
          return res.status(401).json({ error: 'token missing or invalid' })
      }
      const result = await Image.findByIdAndRemove(req.params.id).populate('band')
      if (result.band) {
          const band = await Band.findById(result.band._id)
          band.gallery = band.gallery.filter(a => a._id !== result._id)
          await band.save()
      }
      
      console.log(result)
      res.status(204).end()

    } catch (exception) {
      res.status(400).send({ error: 'malformatted id' })
    }
  
})

module.exports = imagesRouter