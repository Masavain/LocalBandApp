const concertsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const User = require('../models/user')
const Concert = require('../models/concert')

concertsRouter.get('/', async (req, res) => {
    const concerts = await Concert
        .find({})
        .populate('band')
    res.json(concerts)
})

concertsRouter.post('/', async (req, res) => {
    const { name, date, about, place, bandId } = req.body

    try {
        if (!name || !date || !place || !bandId) {
            return res.status(400).json({ error: 'content missing' })
        }
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        const band = await Band.findById(bandId)
        const concert = new Concert({ name, date, about, place, band: bandId })
        const result = await concert.save()
        result.band = band

        band.concerts = band.concerts.concat(concert._id)
        await band.save()
        res.status(201).json(result)

    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            res.status(401).json({ error: exception.message })
        } else {
            res.status(500).json({ error: 'something went wrong...' })
        }
    }

})

concertsRouter.put('/:id', async (req, res) => {
    try {
        const { name, date, about, place } = req.body
        const vanha = await Concert.findById(req.params.id)

        const uusi = { name: name ? name : vanha.name,
            date: date ? date : vanha.date,
            about: about ? about : vanha.about ,
            place: place ? place : vanha.place}

        const updated = await Concert.findByIdAndUpdate(req.params.id, uusi, { new: true })
        res.status(200).json(Concert.format(updated))

    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
})

concertsRouter.get('/:id', async (req, res) => {
    try {
        const concert = await Concert.findById(req.params.id).populate('band')
        if (concert) {
            res.json(Concert.format(concert))
          } else {
            res.status(404).end()
          }

    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
})

concertsRouter.delete('/:id', async (req, res) => {
      try{
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('decoded', decodedToken)

        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const tobeDeleted = await Concert.findById(req.params.id)
        const band = await Band.findById(tobeDeleted.band)
        const result = await Concert.findByIdAndRemove(req.params.id)
        band.concerts = band.concerts.filter(c => c._id !== result._id)
        await band.save()
        res.status(204).end()
        
      } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
      }
    
  })

module.exports = concertsRouter