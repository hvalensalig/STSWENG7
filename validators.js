const { body } = require('express-validator');

const registerValidation = [
    body('firstname').not().isEmpty().withMessage("First Name is required!"),
    body('lastname').not().isEmpty().withMessage("Last Name is required!"),
    body('location').not().isEmpty().withMessage("Location is required!"),
    body('username').not().isEmpty().withMessage("Username is required!"),
    body('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
    body('rePassword').isLength({ min: 8 }).withMessage("Re-enter password must be at least 8 characters long.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
];

const loginValidation = [
    body('username').not().isEmpty().withMessage("Username is required!"),
    body('password').not().isEmpty().withMessage("Password is required!")
];

module.exports = { registerValidation, loginValidation};