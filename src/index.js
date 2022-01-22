const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('get requests are disable')
//     }else{
//         next()
//     }
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port', port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async () =>  {
    // const task = await Task.findById('61ebfc81e1a8430b26787583')
    // await task.populate('owner')
    // console.log(task.owner)

    const user = await User.findById('61ebfb0a072ca9cc526f2fce')
    await user.populate('tasks')
    console.log(user.tasks)
}

main()