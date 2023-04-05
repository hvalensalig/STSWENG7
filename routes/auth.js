const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/userAuth');

router.post('/register', registerValidation, userController.register)
router.post('/login', loginValidation, userController.login)
//router.get('/logout', userController.logoutUser)
router.get(`/logout`, isPrivate, userController.logoutUser);

module.exports = router;