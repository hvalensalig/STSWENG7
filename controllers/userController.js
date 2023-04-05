const user = require('../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Just used when creating the initial admin account for the client

exports.register = async (req, res) => {
    
    const errors = validationResult(req)
    console.log(errors)

    if (errors.isEmpty()) {
        const { username, password, rePassword } = req.body;
        const checkUsername = await user.findOne({username:username})
        if (checkUsername) {
            req.flash('error_msg', 'Username is already in use.');
            console.log('Username is already in use');
            res.redirect('/register');
            //flag = "x";
        } else if (password != rePassword) {
            req.flash('error_msg', 'Password is not the same.');
            console.log('Password not the same')
            res.redirect('/register')
            //flag = "x";
        } else {
            var error;
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hashed) => {
                const newUser = {
                    username,
                    password: hashed,
                };
                await user.create(newUser)
                req.flash('success_msg', 'You are now Registered');
                console.log('registered')
                res.redirect('/register')
            });
            /*
            if(!error) {
                flag = "x";
            }
            */
        }
        /*
        if (flag == "x") {
            res.redirect('/register');
        };
        */
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join("\r"));
        console.log('There is error in the inputs')
        res.redirect('/register');
    }
};


// Find the admin username and password in the database and compare if it is the same with the input, if yes, redirect to admin.ejs
exports.login = async (req, res) => {

    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const {username, password} = req.body;
        const checkUser = await user.findOne({username: username})
        if (checkUser == null) {
            req.flash('error_msg', 'Username does not exist!');
            console.log('Username does not exist')
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
                    console.log('Wrong password')
                    res.redirect('/login');
                }
            });
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join("\r"));
        console.log('There is error in the inputs')
        res.redirect('/login');
    }
}

// Clear the cookie of admin
exports.logoutUser = (req, res) => {
    if (req.session.username) {
        req.session.destroy(() => {
            console.log("User logged out");
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }
};

