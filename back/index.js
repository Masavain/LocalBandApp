// import { request } from 'http';

const http = require('http')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const bandsRouter = require('./controllers/bands')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const imagesRouter = require('./controllers/images')
const albumsRouter = require('./controllers/albums')

const config = require('./utils/config')

mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)
app.use(middleware.tokenExtractor)
app.use('/api/bands', bandsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/images', imagesRouter)
app.use('/api/albums', albumsRouter)
app.use(express.static(__dirname + '/public'))

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
})

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
  
  server.on('close', () => {
    mongoose.connection.close()
  })
  
  module.exports = {
    app, server
  }