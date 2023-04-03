const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validators.js')

router.post('/register', registerValidation, userController.register)
//router.post('/login', loginValidation, userController.login)
//router.get('/logout', userController.logoutUser)

module.exports = router;