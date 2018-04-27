const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Band = require('../models/band')
const Album = require('../models/album')
const User = require('../models/user')
const Post = require('../models/post')
const Image = require('../models/image')
const { formatBand, formatAlbum, formatPost, formatImage,
    initialPosts, initialBands, initialAlbums, initialImages,
    nonExistingAlbumId, nonExistingPostId, nonExistingBandId, nonExistingImageId,
    bandsInDb, usersInDb, albumsInDb, postsInDb, imagesInDb } = require('./test_helper')
let token

describe('when there is initially some bands and albums saved', async () => {
    beforeAll(async () => {
        await Band.remove({})
        await Album.remove({})
        await User.remove({})
        await Post.remove({})
        await Image.remove({})
        await api.post('/api/users').send({
            username: 'kayttaja',
            password: 'secred',
            name: 'none',
            role: 'admin'
        }).expect(201)
        const bandObjects = initialBands.map(band => new Band(band))
        const promiseArray = bandObjects.map(band => band.save())
        await Promise.all(promiseArray)
        const albumObjects = initialAlbums.map(album => new Album(album))
        const promiseArrayTwo = albumObjects.map(a => a.save())
        await Promise.all(promiseArrayTwo)
        const postObjects = initialPosts.map(post => new Post(post))
        const promiseArrayThree = postObjects.map(a => a.save())
        await Promise.all(promiseArrayThree)
        const imageObjects = initialImages.map(image => new Image(image))
        const promiseArrayFour = imageObjects.map(a => a.save())
        await Promise.all(promiseArrayFour)
        const res = await api.post('/api/login').send({
            username: 'kayttaja',
            password: 'secred',
        }).expect(200)
        token = `Bearer ${res.body.token}`
    })
    test('token is found', async () => {
        expect(token)
    })
    describe('users', async () => {
        test('users contain testuser by GET /api/users', async () => {
            const usersindatabase = await usersInDb()
            const res = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(res.body.length).toBe(usersindatabase.length)
            expect(res.body.length).toBe(1)
        })

        test('users contain testuser by GET /api/users/:id', async () => {
            const usersindatabase = await usersInDb()
            const testuser = usersindatabase[0]
            const res = await api
                .get(`/api/users/${testuser._id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(res.body.username).toBe(testuser.username)
        })
        test('POST in /api/users works with valid data', async () => {
            const usersindatabase = await usersInDb()
            const newUser = {
                username: 'toinenkayttaja',
                password: 'sekret',
                name: 'none'
            }
            const res = await api
                .post(`/api/users`)
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAfterOperation = await usersInDb()
            expect(res.body.username).toBe(newUser.username)
            expect(usersAfterOperation.length).toBe(usersindatabase.length + 1)
        })

        test('POST in /api/users fails with username that exists or password too short', async () => {
            const newUser = {
                username: 'kayttaja',
                password: 'sekret',
                name: 'none'
            }
            const newUser2 = {
                username: 'uusikayttaja',
                password: 'a',
                name: 'none'
            }
            await api
                .post(`/api/users`)
                .send(newUser)
                .expect(400)
            await api
                .post(`/api/users`)
                .send(newUser2)
                .expect(400)

        })
        test('POST in /api/users fails with no data sent', async () => {
            await api.post(`/api/users`).expect(500)
        })

    })


    test('bands are returned as json by GET /api/bands', async () => {
        const bandsInDatabase = await bandsInDb()

        const res = await api
            .get('/api/bands')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body.length).toBe(bandsInDatabase.length)

        const returnedNames = res.body.map(n => n.name)
        bandsInDatabase.forEach(band => {
            expect(returnedNames).toContain(band.name)
        })
    })
    test('testband is returned', async () => {
        const bandsInDatabase = await bandsInDb()
        const testband = bandsInDatabase[0]

        const response = await api
            .get(`/api/bands/${testband.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.name).toBe(testband.name)
    })

    test('404 returned by GET /api/bands/:id with nonexisting valid id', async () => {
        const validNonexistingId = await nonExistingBandId()

        const response = await api
            .get(`/api/bands/${validNonexistingId}`)
            .expect(404)
    })
    test('400 is returned by GET /api/bands/:id with invalid id', async () => {
        const invalidId = "5a3d5da59070081a82a3445"

        const response = await api
            .get(`/api/bands/${invalidId}`)
            .expect(400)
    })



    describe('addition of a new note', async () => {

        test('POST /api/bands succeeds with valid data', async () => {
            const bandsInBeginning = await bandsInDb()

            const newBand = {
                name: 'bandtobeadded',
                genre: 'pop',
                hometown: 'Helsinki',
                started: 2017
            }

            await api
                .post('/api/bands')
                .send(newBand)
                .set({ Authorization: token })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const bandsAfterOperation = await bandsInDb()

            expect(bandsAfterOperation.length).toBe(bandsInBeginning.length + 1)

            const names = bandsAfterOperation.map(r => r.name)
            expect(names).toContain('bandtobeadded')
        })


        test('POST /api/bands fails with proper statuscode if name is missing', async () => {
            const bandsInBeginning = await bandsInDb()

            const newBand = {
                genre: 'pop',
                hometown: 'Helsinki',
                started: 2017
            }

            await api
                .post('/api/bands')
                .send(newBand)
                .set({ Authorization: token })
                .expect(400)

            const bandsAfterOperation = await bandsInDb()
            expect(bandsAfterOperation.length).toBe(bandsInBeginning.length)
        })
    })

    describe('deletion and update of a note', async () => {
        test('PUT /api/bands/:id succeeds with proper statuscode', async () => {
            const bandsInBeginning = await bandsInDb()
            const testband = bandsInBeginning[1]
            const res = await api
                .put(`/api/bands/${testband.id}`)
                .send({ about: 'new about', genre: 'new genre', started: 0 })
                .set({ Authorization: token })
                .expect(200)

            const bandsAfterOperation = await bandsInDb()
            const genres = bandsAfterOperation.map(b => b.genre)
            const abouts = bandsAfterOperation.map(b => b.about)

            expect(res.body.about).toBe('new about')
            expect(genres).toContain('new genre')
            expect(abouts).toContain('new about')
            expect(bandsAfterOperation.length).toBe(bandsInBeginning.length)

        })

        test('PUT /api/bands/:id fails with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .put(`/api/bands/${invalidId}`)
                .send({ about: 'nothing really..' })
                .set({ Authorization: token })
                .expect(400)
        })

        test('DELETE /api/bands/:id succeeds with proper statuscode', async () => {
            const bandsInBeginning = await bandsInDb()
            const testband = bandsInBeginning[0]

            await api
                .delete(`/api/bands/${testband.id}`)
                .set({ Authorization: token })
                .expect(204)

            const bandsAfterOperation = await bandsInDb()

            const names = bandsAfterOperation.map(r => r.name)
            expect(names).not.toContain(testband.name)
            expect(bandsAfterOperation.length).toBe(bandsInBeginning.length - 1)
        })

    })

    describe('youtube and bandcamp POST', async () => {
        test('POST /api/bands/:id/youtube works and returns right', async () => {
            const bandsInBeginning = await bandsInDb()
            const testband = bandsInBeginning[0]
            const res = await api
                .post(`/api/bands/${testband.id}/youtube`)
                .send({ youtubeID: 'https//url.url' })
                .set({ Authorization: token })

            expect(res.body.youtubeID).toBe('https//url.url')
        })

        test('POST /api/bands/:id/youtube with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .post(`/api/bands/${invalidId}/youtube`)
                .send({ youtubeID: 'https//url.url' })
                .set({ Authorization: token })
                .expect(400)
        })

        test('POST /api/bands/:id/bandcamp works and returns right', async () => {
            const bandsInBeginning = await bandsInDb()
            const testband = bandsInBeginning[0]
            const res = await api
                .post(`/api/bands/${testband.id}/bandcamp`)
                .send({ albumUrl: 'https://memobandfin.bandcamp.com/album/mustavalkofilmi' })
                .set({ Authorization: token })
            expect(res.body.bcURL).toBe('https://memobandfin.bandcamp.com/album/mustavalkofilmi')
        })

        test('POST /api/bands/:id/bandcamp with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .post(`/api/bands/${invalidId}/bandcamp`)
                .send({ albumUrl: 'https://memobandfin.bandcamp.com/album/mustavalkofilmi' })
                .set({ Authorization: token })
                .expect(400)
        })
    })
    describe('albums', async () => {
        test('albums are returned as json by GET /api/albums', async () => {
            const albumsInDatabase = await albumsInDb()

            const res = await api
                .get('/api/albums')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(res.body.length).toBe(albumsInDatabase.length)
            const returnedNames = res.body.map(n => n.name)
            albumsInDatabase.forEach(album => {
                expect(returnedNames).toContain(album.name)
            })
        })
        test('testalbum is returned', async () => {
            const albumsInDatabase = await albumsInDb()
            const testalbum = albumsInDatabase[0]

            const response = await api
                .get(`/api/albums/${testalbum.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.name).toBe(testalbum.name)
        })

        test('404 returned by GET /api/albums/:id with nonexisting valid id', async () => {
            const validNonexistingId = await nonExistingAlbumId()
            const response = await api
                .get(`/api/albums/${validNonexistingId}`)
                .expect(404)
        })
        test('POST /api/albums succeeds with valid data', async () => {
            const albumsInBeginning = await albumsInDb()
            const bandsInBeginning = await bandsInDb()
            const bandId = bandsInBeginning[0].id

            const newAlbum = {
                name: 'albumtobeadded',
                year: 2000,
                about: 'not much',
                bandId
            }

            await api
                .post('/api/albums')
                .send(newAlbum)
                .set({ Authorization: token })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const albumsAfterOperation = await albumsInDb()

            expect(albumsAfterOperation.length).toBe(albumsInBeginning.length + 1)

            const names = albumsAfterOperation.map(r => r.name)
            expect(names).toContain('albumtobeadded')
        })

        test('POST /api/albums fails with no data sent', async () => {
            const response = await api
                .post(`/api/albums`)
                .set({ Authorization: token })
                .expect(500)
        })

        test('400 is returned by GET /api/albums/:id with invalid id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"

            const response = await api
                .get(`/api/albums/${invalidId}`)
                .expect(400)
        })

        test('POST /api/albums/:id/bandcamp works with valid data', async () => {
            const albumsInBeginning = await albumsInDb()
            const testalbum = albumsInBeginning[0]
            const res = await api
                .post(`/api/albums/${testalbum.id}/bandcamp`)
                .send({ albumUrl: 'https://memobandfin.bandcamp.com/album/mustavalkofilmi' })
                .set({ Authorization: token })
            expect(res.body.bcURL).toBe('https://memobandfin.bandcamp.com/album/mustavalkofilmi')
        })

        test('POST /api/albums/:id/bandcamp with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .post(`/api/albums/${invalidId}/bandcamp`)
                .send({ albumUrl: 'https://memobandfin.bandcamp.com/album/mustavalkofilmi' })
                .set({ Authorization: token })
                .expect(400)
        })

        test('PUT /api/albums/:id succeeds with proper statuscode', async () => {
            const albumsInBeginning = await albumsInDb()
            const testalbum = albumsInBeginning[0]
            const res = await api
                .put(`/api/albums/${testalbum.id}`)
                .send({ about: 'new about', name: 'new name', year: 10 })
                .set({ Authorization: token })
                .expect(200)
            const albumsAfterOperation = await albumsInDb()
            const names = albumsAfterOperation.map(b => b.name)
            const abouts = albumsAfterOperation.map(b => b.about)
            const years = albumsAfterOperation.map(b => b.year)
            expect(res.body.about).toBe('new about')
            expect(res.body.year).toBe(10)
            expect(res.body.name).toBe('new name')
            expect(names).toContain('new name')
            expect(abouts).toContain('new about')
            expect(years).toContain(10)
            expect(albumsAfterOperation.length).toBe(albumsInBeginning.length)

        })

        test('PUT /api/albums/:id fails with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .put(`/api/albums/${invalidId}`)
                .send({ about: 'nothing really..' })
                .set({ Authorization: token })
                .expect(400)
        })

        test('DELETE /api/albums/:id succeeds with proper statuscode', async () => {
            const albumsInBeginning = await albumsInDb()
            const testalbum = albumsInBeginning[2]
            await api
                .delete(`/api/albums/${testalbum.id}`)
                .set({ Authorization: token })
                .expect(204)

            const albumsAfterOperation = await albumsInDb()

            const names = albumsAfterOperation.map(r => r.name)
            expect(names).not.toContain(testalbum.name)
            expect(albumsAfterOperation.length).toBe(albumsInBeginning.length - 1)
        })
        test('DELETE /api/albums/:id fails with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .delete(`/api/albums/${invalidId.id}`)
                .set({ Authorization: token })
                .expect(400)
        })
    })

    describe('posts', async () => {
        test('posts are returned as json by GET /api/posts', async () => {
            const postsInDatabase = await postsInDb()

            const res = await api
                .get('/api/posts')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(res.body.length).toBe(postsInDatabase.length)
            const returnedTitles = res.body.map(n => n.title)
            postsInDatabase.forEach(post => {
                expect(returnedTitles).toContain(post.title)
            })
        })
        test('testpost is returned', async () => {
            const postsInDatabase = await postsInDb()
            const testpost = postsInDatabase[0]

            const response = await api
                .get(`/api/posts/${testpost.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.title).toBe(testpost.title)
        })

        test('404 returned by GET /api/posts/:id with nonexisting valid id', async () => {
            const validNonexistingId = await nonExistingPostId()
            const response = await api
                .get(`/api/posts/${validNonexistingId}`)
                .expect(404)
        })
        test('POST /api/posts succeeds with valid data', async () => {
            const postsInBeginning = await postsInDb()

            const newPost = {
                title: 'postToBeAdded',
                content: 'lorem ipsum etc',
                author: 'no-one',
            }

            await api
                .post('/api/posts')
                .send(newPost)
                .set({ Authorization: token })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const postsAfterOperation = await postsInDb()

            expect(postsAfterOperation.length).toBe(postsInBeginning.length + 1)

            const titles = postsAfterOperation.map(r => r.title)
            expect(titles).toContain('postToBeAdded')
        })

        test('POST /api/posts fails with no data sent', async () => {
            const response = await api
                .post(`/api/posts`)
                .set({ Authorization: token })
                .expect(400)
        })

        test('400 is returned by GET /api/posts/:id with invalid id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"

            const response = await api
                .get(`/api/posts/${invalidId}`)
                .expect(400)
        })


        test('PUT /api/posts/:id succeeds with proper statuscode', async () => {
            const postsInBeginning = await postsInDb()
            const testpost = postsInBeginning[0]
            const res = await api
                .put(`/api/posts/${testpost.id}`)
                .send({ content: 'something something something' })
                .set({ Authorization: token })
                .expect(200)
            const postsAfterOperation = await postsInDb()
            expect(res.body.content).toBe('something something something')
            const contents = postsAfterOperation.map(a => a.content)
            expect(contents).toContain('something something something')
            expect(postsAfterOperation.length).toBe(postsInBeginning.length)

        })

        test('PUT /api/posts/:id fails with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .put(`/api/posts/${invalidId}`)
                .send({ content: 'nothing really..' })
                .set({ Authorization: token })
                .expect(400)
        })

        test('DELETE /api/albums/:id succeeds with proper statuscode', async () => {
            const postsInBeginning = await postsInDb()
            const testpost = postsInBeginning[0]
            await api
                .delete(`/api/posts/${testpost.id}`)
                .set({ Authorization: token })
                .expect(204)

            const postsAfterOperation = await postsInDb()

            const titles = postsAfterOperation.map(r => r.title)
            expect(titles).not.toContain(testpost.name)
            expect(postsAfterOperation.length).toBe(postsInBeginning.length - 1)
        })
        test('DELETE /api/albums/:id fails with malformatted id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            await api
                .delete(`/api/posts/${invalidId.id}`)
                .set({ Authorization: token })
                .expect(400)
        })
    })

    describe('images', async () => {
        test('images are returned as json by GET /api/images', async () => {
            const imagesInDatabase = await imagesInDb()

            const res = await api
                .get('/api/images')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(res.body.length).toBe(imagesInDatabase.length)
            const returnedTitles = res.body.map(n => n.title)
            imagesInDatabase.forEach(post => {
                expect(returnedTitles).toContain(post.title)
            })
        })
        test('testimage is returned', async () => {
            const imagesInDatabase = await imagesInDb()
            const testimage = imagesInDatabase[0]

            const response = await api
                .get(`/api/images/${testimage.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.title).toBe(testimage.title)
        })

        test('404 returned by GET /api/images/:id with nonexisting valid id', async () => {
            const validNonexistingId = await nonExistingImageId()
            const response = await api
                .get(`/api/images/${validNonexistingId}`)
                .expect(404)
        })
        test('POST /api/images succeeds with valid data', async () => {
            const imagesInBeginning = await imagesInDb()
            const bandsInBeginning = await bandsInDb()
            const bandId = bandsInBeginning[0].id


            const newImage = {
                url: 'https://i.imgur.com/Rz3uanH.jpg',
                imageType: 'image/jpeg',
                height: 1200,
                width: 1200,
                animated: false,
                deleteHash: 'TrpARB0StMMcSpB',
                size: 104140,
                type: 'avatar',
                bandId
            }

            await api
                .post('/api/images')
                .send(newImage)
                .set({ Authorization: token })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const imagesAfterOperation = await imagesInDb()

            expect(imagesAfterOperation.length).toBe(imagesInBeginning.length + 1)

            const urls = imagesAfterOperation.map(r => r.url)
            expect(urls).toContain('https://i.imgur.com/Rz3uanH.jpg')
        })

        test('POST /api/images/albumart succeeds with valid data', async () => {
            const imagesInBeginning = await imagesInDb()
            const albumsInBeginning = await albumsInDb()
            const albumId = albumsInBeginning[0].id


            const newImage = {
                url: 'https://i.imgur.com/OuXNSRA.jpg',
                imageType: 'image/jpeg',
                height: 1200,
                width: 1200,
                animated: false,
                deleteHash: 'Pcz6YHWCa439Ooy',
                size: 104140,
                type: 'album',
                albumId
            }

            await api
                .post('/api/images/albumart')
                .send(newImage)
                .set({ Authorization: token })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const imagesAfterOperation = await imagesInDb()

            expect(imagesAfterOperation.length).toBe(imagesInBeginning.length + 1)

            const urls = imagesAfterOperation.map(r => r.url)
            expect(urls).toContain('https://i.imgur.com/OuXNSRA.jpg')
        })

        test('POST /api/images/postimage succeeds with valid data', async () => {
            const imagesInBeginning = await imagesInDb()
            const postsInBeginning = await postsInDb()
            const postId = postsInBeginning[0].id


            const newImage = {
                url: 'https://i.imgur.com/OuXNSRA.jpg',
                imageType: 'image/jpeg',
                height: 1200,
                width: 1200,
                animated: false,
                deleteHash: 'Pcz6YHWCa439Ooy',
                size: 104140,
                type: 'post',
                postId
            }

            await api
                .post('/api/images/postimage')
                .send(newImage)
                .set({ Authorization: token })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const imagesAfterOperation = await imagesInDb()

            expect(imagesAfterOperation.length).toBe(imagesInBeginning.length + 1)

            const urls = imagesAfterOperation.map(r => r.url)
            expect(urls).toContain('https://i.imgur.com/OuXNSRA.jpg')
        })

        test('POST /api/images fails with no data sent', async () => {
            const response = await api
                .post(`/api/images`)
                .set({ Authorization: token })
                .expect(500)
        })

        test('POST /api/images/albumart fails with no data sent', async () => {
            const response = await api
                .post(`/api/images/albumart`)
                .set({ Authorization: token })
                .expect(500)
        })
        test('POST /api/images/postimage fails with no data sent', async () => {
            const response = await api
                .post(`/api/images/postimage`)
                .set({ Authorization: token })
                .expect(500)
        })

        test('400 is returned by GET /api/images/:id with invalid id', async () => {
            const invalidId = "5a3d5da59070081a82a3445"
            const response = await api
                .get(`/api/images/${invalidId}`)
                .expect(400)
        })


        // test('DELETE /api/images/:id succeeds with proper statuscode', async () => {
        //     const imagesInBeginning = await imagesInDb()
        //     const testimage = imagesInBeginning[0]
        //     await api
        //         .delete(`/api/images/${testimage.id}`)
        //         .set({ Authorization: token })
        //         .expect(204)

        //     const imagesAfterOperation = await imagesInDb()

        //     const titles = imagesAfterOperation.map(r => r.title)
        //     expect(titles).not.toContain(testimage.name)
        //     expect(imagesAfterOperation.length).toBe(imagesInBeginning.length - 1)
        // })
        // test('DELETE /api/images/:id fails with malformatted id', async () => {
        //     const invalidId = "5a3d5da59070081a82a3445"
        //     await api
        //         .delete(`/api/images/${invalidId.id}`)
        //         .set({ Authorization: token })
        //         .expect(400)
        // })
    })





    afterAll(() => {
        server.close()
    })
})
