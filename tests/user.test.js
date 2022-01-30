const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()

const user01 = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@gmail.com',
    password: 'abc123..',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach( async () => {
    await User.deleteMany()
    await new User(user01).save()
})

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: 'abc123..'
            })
        .expect(201)

    // Assert the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Ali',
            email: 'ali@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('abc123..')
})

test('Should login existing user',  async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: user01.email,
            password: user01.password 
            })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[0].token)
})

test('Should not login nonexisting user',  async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: user01.email,
            password: 'nonexistingpass'
            })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user01.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete acount for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user01.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})



test('Should not delete acount for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test ('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${user01.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user01.tokens[0].token}`)
        .send({
            name: 'AliQ'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('AliQ')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user01.tokens[0].token}`)
        .send({
            location: 'Abegondo'
        })
        .expect(400)
})