const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({})
        .populate('bands', { __v: 0, user: 0})
    res.json(users.map(User.format))
})

usersRouter.post('/', async (req, res) => {
    try {
        const body = req.body

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
            passwordHash
        })

        const savedUser = await user.save()

        res.json(savedUser)
    } catch (exception) {
        console.log(exception)
        res.status(500).json({ error: 'something went wrong...' })
    }
})

module.exports = usersRouter