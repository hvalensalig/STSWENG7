const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/userAuth');

router.post('/register', isPublic, registerValidation, userController.register)
router.post('/login', isPublic, loginValidation, userController.login);
router.get(`/logout`, isPrivate, userController.logoutUser);

module.exports = router;