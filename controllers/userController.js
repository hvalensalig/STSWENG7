const user = require('../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Create the users account to use the web application
exports.register = async (req, res) => {

    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const { firstname, lastname, location, username, password, rePassword } = req.body;
        const checkUsername = await user.findOne({username:username})
        if (checkUsername) {
            req.flash('error_msg', 'Username is already in use.');
            console.log('Username is already in use');
            res.redirect('/register');
        } else if (password != rePassword) {
            req.flash('error_msg', 'Password is not the same.');
            console.log('Password not the same')
            res.redirect('/register')
        } else {
            const name = username;
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hashed) => {
                const newUser = {
                    firstname,
                    lastname,
                    location,
                    username,
                    password: hashed,
                    name,
                };
                await user.create(newUser)
                req.flash('success_msg', 'You are now Registered.');
                console.log('registered')
                res.redirect('/register')
            });
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join("\r"));
        console.log('There is error in the inputs')
        res.redirect('/register');
    }
};

// Find the users username and password in the database and compare if it is the same with the input, if yes, redirect to home
exports.login = async (req, res) => {

    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const {username, password} = req.body;
        const checkUser = await user.findOne({username: username})
        if (checkUser == null) {
            req.flash('error_msg', 'Username does not exist!');
            console.log('Username does not exist');
            res.redirect('/login');
        } else {
            checkUser.toObject()
            bcrypt.compare(password, checkUser.password, (err, result) => {
                if (result) {
                    req.session.username = checkUser.username;
                    console.log('Logged In')
                    res.redirect('/home');
                } else {
                    req.flash('error_msg', 'Incorrect password!');
                    console.log('Wrong password');
                    res.redirect('/login');
                }
            });
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join("\r"));
        console.log('There is error in the inputs');
        res.redirect('/login');
    }
}

// Clear the cookie of the user
exports.logoutUser = (req, res) => {
    if (req.session.username) {
        req.session.destroy(() => {
            console.log("User logged out");
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }
};
