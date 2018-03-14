const bandsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const User = require('../models/user')


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
        
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)

        const band = new Band({ name, genre, started, hometown, about: (about || ''), active: true, user: user._id})
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

module.exports = bandsRouter