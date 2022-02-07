const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const userTwoId = new mongoose.Types.ObjectId()
const user02 = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@gmail.com',
    password: 'qwerty123.',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const task01 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: user01._id
}

const task02 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: false,
    owner: user01._id
}

const task03 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: false,
    owner: user02._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user01).save()
    await new User(user02).save()
    await new Task(task01).save()
    await new Task(task02).save()
    await new Task(task03).save()
}

module.exports = {
    user01,
    userOneId,
    user02,
    userTwoId,
    task01,
    task02,
    task03,
    setupDatabase
}