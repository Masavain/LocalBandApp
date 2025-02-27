const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({})
        .populate('bands', { __v: 0, user: 0})
        .populate('posts')
        .populate('favBands')
    res.json(users.map(User.format))
})

usersRouter.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bands').populate('images').populate('favBands')
        res.json(User.format(user))

    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})

usersRouter.post('/', async (req, res) => {
    const body = req.body
    try {
        const existingUser = await User.find({ username: body.username })
        if (body.password.length < 3) {
            return res.status(400).json({ error: 'password too short (must be at least 3 characters long)'})
        }
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'username must be unique' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        const user = new User({
            username: body.username,
            name: body.name,
            role: body.role ? body.role : 'user',
            passwordHash
        })

        const savedUser = await user.save()

        res.status(201).json(savedUser)
    } catch (exception) {
        console.log(exception)
        res.status(500).json({ error: 'something went wrong...' })
    }
})

usersRouter.put('/:id', async (req, res) => {
    try {
        const { favBands } = req.body
        const vanha = await User.findById(req.params.id)
        const uusi = {
            favBands
        }
        const updated = await User.findByIdAndUpdate(req.params.id, uusi, { new: true })
            .populate('bands', { __v: 0, user: 0})
            .populate('posts')
            .populate('favBands')
        res.json(User.format(updated))

    } catch (exception) {
        res.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = usersRouter