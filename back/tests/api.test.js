const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Band = require('../models/band')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { format, initialBands, nonExistingId, bandsInDb, usersInDb } = require('./test_helper')
let token

describe('when there is initially some bands saved', async () => {
    beforeAll(async () => {
        await Band.remove({})
        const bandObjects = initialBands.map(band => new Band(band))
        const promiseArray = bandObjects.map(band => band.save())
        await Promise.all(promiseArray)
        const res = await api.post('/api/login').send({
            username: 'kayttaja',
            password: 'secreed',
        }).expect(200)
        token = `Bearer ${res.body.token}`
    })
    // test('asd', async () => {
    //     await console.log(token)
    //     expect(token)
    // })
    test('users contain testuser by GET /api/users', async () => {
        const usersindatabase = await usersInDb()
        const res = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body.length).toBe(usersindatabase.length)
        expect(res.body.length).toBe(1)
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
        const validNonexistingId = await nonExistingId()
    
        const response = await api
          .get(`/api/bands/${validNonexistingId}`)
          .expect(404)
      })
      test('400 is returned by GET /api/notes/:id with invalid id', async () => {
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
            .set({ Authorization: token})
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
          const bandsAfterOperation = await bandsInDb()
    
          expect(bandsAfterOperation.length).toBe(bandsInBeginning.length + 1)
    
          const names = bandsAfterOperation.map(r => r.name)
          expect(names).toContain('bandtobeadded')
        })


        test('POST /api/notes fails with proper statuscode if name is missing', async () => {
            const bandsInBeginning = await bandsInDb()

            const newBand = {
                genre: 'pop',
                hometown: 'Helsinki',
                started: 2017
              }
        
          await api
            .post('/api/bands')
            .send(newBand)
            .set({ Authorization: token})
            .expect(400)
    
          const bandsAfterOperation = await bandsInDb()    
          expect(bandsAfterOperation.length).toBe(bandsInBeginning.length)
        })
      })
    
      describe('deletion of a note', async () => {
        let addedBand
    
        beforeAll(async () => {
            addedBand = new Band({
            name: 'bandtobedeleted',
            genre: 'pop',
            hometown: 'Helsinki',
            started: 2017
          })
          await addedBand.save()
        })
    
        test('DELETE /api/bands/:id succeeds with proper statuscode', async () => {
            const bandsInBeginning = await bandsInDb()
    
            await api
                .delete(`/api/bands/${addedBand._id}`)
                .set({ Authorization: token})
                .expect(204)
    
          const bandsAfterOperation = await bandsInDb()
    
          const names = bandsAfterOperation.map(r => r.name)
          expect(names).not.toContain(addedBand.name)
          expect(bandsAfterOperation.length).toBe(bandsInBeginning.length - 1)
        })
      })
    
      afterAll(() => {
        server.close()
      })
    
    })