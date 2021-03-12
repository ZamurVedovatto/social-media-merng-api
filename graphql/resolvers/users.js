const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const { validateRegisterInput } = require('./../../util/validators')
const { SECRET_KEY } = require('./../../config')
const User = require('./../../models/User')

module.exports = {
  Mutation: {
    async register(_, { registerInput: { username, email, password, confirmPassword }}) {
      // validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
      if(!valid) {
        throw new UserInputError('Erros'), { errors }
      }

      // make sure user doesnt already exists
      const user = await User.findOne({ username })
      if(user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }

      // hash password and create auth token
      password = await bcrypt.hash(password, 12)
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      })
      const result = await newUser.save()
      const token = jwt.sign({
        id: result.id,
        username: result.username,
        email: result.email,
      }, SECRET_KEY, { expiresIn: '1h' })
      return {
        ...result._doc,
        id: result._id,
        token
      }
    }
  }
}