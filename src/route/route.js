const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const middleware = require('../middleware/middleware')


router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.get('/list',middleware.userAuth,userController.userDetails)
router.put('/update/:userId',middleware.userAuth,userController.updateUser)
router.get('/filter/:userId',middleware.userAuth,userController.filter)
module.exports= router