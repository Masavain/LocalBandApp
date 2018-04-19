const postsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Band = require('../models/band')
const Image = require('../models/image')
const User = require('../models/user')
const Album = require('../models/album')

postsRouter.get('/', async (req, res) => {
    const posts = await Post
        .find({})
        .populate('images')
        .populate('user')
    res.json(posts)
})

postsRouter.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('images').populate('user')
        res.json(Post.format(post))
    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})

postsRouter.post('/', async (req, res) => {
    const body = req.body
  
    try {
      const token = getTokenFrom(req)
      const decodedToken = jwt.verify(token, process.env.SECRET)
  
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
      }
  
      if (body.content === undefined) {
        return res.status(400).json({ error: 'content missing' })
      }
  
      const user = await User.findById(decodedToken.id)
      if (user.role !== 'admin') {
        return res.status(401).json({ error: 'unauthorized' })
      }

      const post = new Post({
        title: body.title,
        content: body.content ? body.content : '',
        date: new Date,
        images: [],
        author: body.author ? body.author : user.name,
        user: user._id
      })
  
      const saved = await post.save()
      user.posts = user.posts.concat(saved._id)
      await user.save()
  
      res.json(Post.format(saved))
    } catch(exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        res.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        res.status(500).json({ error: 'something went wrong...' })
      }
    }
  })

  postsRouter.put('/:id', async (req, res) => {
    try {
        const token = getTokenFrom(req)
        const decodedToken = jwt.verify(token, process.env.SECRET)
  
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
      
        if (body.content === undefined) {
            return res.status(400).json({ error: 'content missing' })
        }
  
        const user = await User.findById(decodedToken.id)
        if (user.role !== 'admin') {
            return res.status(401).json({ error: 'unauthorized' })
        }
        const { content } = req.body
        const vanha = await Post.findById(req.params.id)
        const uusi = { content }
        console.log('uusi: ', uusi)
        const updated = await Post.findByIdAndUpdate(req.params.id, uusi, { new: true }).populate('user').populate('images')
        res.json(Post.format(updated))

    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
  })

  postsRouter.delete('/:id', async (req, res) => {
    try {
        const token = req.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        if (user.role !== 'admin') {
            return res.status(401).json({ error: 'unauthorized' })
        }
        const result = await Post.findByIdAndRemove(req.params.id)
        user.posts = user.posts.filter(b => b._id !== result._id)
        await user.save()
        console.log(result)
        res.status(204).end()
    } catch (exception) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})


module.exports = postsRouter