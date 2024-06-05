const router = require('express').Router();
const userController = require('../controllers/userControllers')


// Creating user registration route
router.post('/create', userController.createUser)

// login routes
router.post('/login', userController.loginUser)


// exporting the router
module.exports = router