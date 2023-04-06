const db = require('../models/db.js');
const Recipe = require('../models/RecipeModel.js');
const User = require('../models/users');

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },
    getStart: function (req, res) {
        res.render('login');
    },

    getHome: function (req, res) {
        var query = { username: req.session.username };
        var query1 = { username: req.session.username};
        var projection = { __v: 0 };
        try {

            db.findOne(User, query, projection, function (result1) {
                if (result1 != null) {
                    
                    db.findMany(Recipe, query1, projection, function (result2) {
                        console.log("result1", result1);
                        console.log("result2", result2);
                        if (result2 != null) {
                            res.render('home', { username: result1.username, 
                                name: result1.firstname+result1.lastname, 
                                location: result1.location, 
                                page1: '#4a89ff', 
                                result2: result2});
                        }
                        else{
                            res.render('home', { username: result1.username, 
                                name: result1.name, 
                                location: result1.location, 
                                page1: '#4a89ff'});
                        }
                    })

                }
            });

        } catch (error) {
            console.log(error.message);
        }

    },

    getSearch: function (req, res) {
        res.render('search', { page2: '#4a89ff' });
    },

    getAddRecipe: function (req, res) {

        res.render('addRecipe', { page3: '#4a89ff' });
    },

    getRegister: function (req, res) {
        res.render('register');
    },

    postRegister: function (req, res) {
        res.redirect('/login');
    },

    getLogin: function (req, res) {
        res.render('login');
    },

    postLogin: function (req, res) {
        res.redirect('/home');
    },

    getLogout: function (req, res) {
        res.redirect('/login');
    },

}

module.exports = controller;