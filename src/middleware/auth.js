const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // if no token (trycatch)
        const token = req.header('Authorization').replace('Bearer ', '') // Provided token
        const decoded = jwt.verify(token, 'entrenemosnutricion') //decode token 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) // check if the token and id are valid 

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })    
    }
}

module.exports = auth