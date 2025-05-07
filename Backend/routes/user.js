const express = require('express')
const zod = require('zod')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')

const {User, Account } = require('../db')

const router = express.Router()

const signUpBody = zod.object({
  username:zod.string(),
  password:zod.string(),
  firstname:zod.string(),
  lastname:zod.string()
})

router.post('/signup', async function(req, res){
  const {success} = signUpBody.safeParse(req.body)
  if(!success) {
    res.status(411).json({
      message: 'Email already taken / Incorrect inputs'
    })
  }

  const existingUser = await User.findOne({
    username: req.body.username
  })
  if(existingUser){
    return res.status(411).json({
      message: 'User already exists'
    })
  }

  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  })
  const userId = newUser._id

  const token = jwt.sign({
    userId
  }, JWT_SECRET)

  res.json({
    message: 'User created successfully',
    token: token
  })

})


