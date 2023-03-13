const { body } = require('express-validator');

const registerValidation = [
    body('regUsername').not().isEmpty().withMessage("Username is required!"),
    body('regPassword').not().isEmpty().withMessage("Password is required!"),
    body('regRePassword').not().isEmpty().withMessage("Please retype password!")
];

const loginValidation = [
    body('username').not().isEmpty().withMessage("Username is required!"),
    body('password').not().isEmpty().withMessage("Password is required!")
];

module.exports = { registerValidation, loginValidation};