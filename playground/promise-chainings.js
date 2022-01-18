require('../src/db/mongoose')

const User = require('../src/models/user')

// 61e06d03d0782feddf70614e

// User.findByIdAndUpdate('61e58beb72d68517d85c695e', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndcount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments( {age} )
    return count
}

updateAgeAndcount('61e58beb72d68517d85c695e', 5).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})