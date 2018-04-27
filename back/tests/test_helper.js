const Band = require('../models/band')
const User = require('../models/user')
const Album = require('../models/album')
const Image = require('../models/image')
const Post = require('../models/post')

const initialBands = [
    {
        name: 'testband',
        genre: 'pop',
        hometown: 'Helsinki',
        started: 2017,
        about: 'asdasd'
    },
    {
        name: 'testband2',
        genre: 'rock',
        hometown: 'Helsinki',
        started: 2015,
        about: ''
    },
    {
        name: 'testband3',
        genre: 'punk',
        hometown: 'Tampere',
        started: 2018,
        about: ''
    }
]

const initialAlbums = [
    {
        name: 'testalbum',
        year: 2000,
        about: 'nothing here',
    },
    {
        name: 'testalbum2',
        year: 2001,
        about: 'nothing here either',
    },
]
const initialPosts = [
    {
        title: 'first post',
        content: 'not much here',
        author: 'me'
    },
    {
        title: 'second post',
        content: 'not much here either',
        author: 'me again',
    }
]

const initialImages = [
    {
        url: 'https://i.imgur.com/E4ef0gF.jpg',
        imageType: "image/jpeg",
        height: 1200,
        width: 1200,
        animated: false,
        deleteHash: "UmQkqJal4zdXHox",
        size: 104140,
        type: "background",
    }
]
const formatImage = (image) => {
    return {
        id: image._id,
        url: image.url,
        type: image.type,
        height: image.height,
        width: image.width,
        animated: image.animated,
        deletehash: image.deletehash,
        size: image.size,
        type: image.type,
    }
}
const formatBand = (band) => {
    return {
        name: band.name,
        genre: band.genre,
        hometown: band.hometown,
        started: band.started,
        about: band.about,
        id: band._id
    }
}
const formatPost = (post) => {
    return {
        id: post._id,
        title: post.title,
        content: post.content,
        date: post.date,
        author: post.author,
    }
}
const formatAlbum = (album) => {
    return {
        name: album.name,
        year: album.year,
        about: album.about,
        id: album._id
    }
}

const nonExistingBandId = async () => {
    const band = new Band()
    await band.save()
    await band.remove()
    return band._id.toString()
}

const nonExistingAlbumId = async () => {
    const album = new Album()
    await album.save()
    await album.remove()
    return album._id.toString()
}

const nonExistingPostId = async () => {
    const post = new Post()
    await post.save()
    await post.remove()
    return post._id.toString()
}

const nonExistingImageId = async () => {
    const image = new Image()
    await image.save()
    await image.remove()
    return image._id.toString()
}

const bandsInDb = async () => {
    const bands = await Band.find({})
    return bands.map(formatBand)
}
const usersInDb = async () => {
    const users = await User.find({})
    return users
}
const albumsInDb = async () => {
    const albums = await Album.find({})
    return albums
}
const postsInDb = async () => {
    const posts = await Post.find({})
    return posts
}
const imagesInDb = async () => {
    const images = await Image.find({})
    return images
}
module.exports = {
    initialBands, initialAlbums, initialPosts, initialImages,
    formatBand, formatAlbum, formatPost, formatImage,
    nonExistingBandId, nonExistingAlbumId, nonExistingPostId, nonExistingImageId,
    bandsInDb, usersInDb, albumsInDb, postsInDb, imagesInDb
}