const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user= await User.findOne({ username })

  const checkPassword = user === null ?
    false
    :
    await bcrypt.compare(password, user.passwordHash)

  if(!(user && checkPassword)){
    response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username , name: user.name })
} )

module.exports = loginRouter