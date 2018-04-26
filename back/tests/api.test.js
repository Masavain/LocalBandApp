const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Band = require('../models/band')
const Album = require('../models/album')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { formatBand, formatAlbum, initialBands, initialAlbums, nonExistingAlbumId, nonExistingBandId, bandsInDb, usersInDb, albumsInDb } = require('./test_helper')
let token

describe('when there is initially some bands and albums saved', async () => {
    beforeAll(async () => {
        await Band.remove({})
        await Album.remove({})
        const bandObjects = initialBands.map(band => new Band(band))
        const promiseArray = bandObjects.map(band => band.save())
        await Promise.all(promiseArray)
        const albumObjects = initialAlbums.map(album => new Album(album))
        const promiseArrayTwo = albumObjects.map(a => a.save())
        await Promise.all(promiseArrayTwo)
        const res = await api.post('/api/login').send({
            username: 'kayttaja',
            password: 'secreed',
        }).expect(200)
        token = `Bearer ${res.body.token}`
    })
    test('token is found', async () => {
        expect(token)
    })
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

        test('POST /api/albums fails with malformatted id', async () => {
            const invalidId = await nonExistingAlbumId()
            const response = await api
                .get(`/api/albums/${invalidId}`)
                .expect(404)
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
                .send({ about: 'new about', name: 'new name', year: 0 })
                .set({ Authorization: token })
                .expect(200)

            const albumsAfterOperation = await albumsInDb()
            const names = albumsAfterOperation.map(b => b.name)
            const abouts = albumsAfterOperation.map(b => b.about)
            const years = albumsAfterOperation.map(b => b.year)
            expect(res.body.about).toBe('new about')
            expect(res.body.year).toBe(0)
            expect(res.body.name).toBe('new name')
            expect(names).toContain('new name')
            expect(abouts).toContain('new about')
            expect(years).toContain(0)
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

    afterAll(() => {
        server.close()
    })
})
