const db = require('../models/db.js');
const recipe = require('../models/RecipeModel.js');
const user = require('../models/users');
const { validationResult } = require('express-validator');

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

            db.findOne(user, query, projection, function (result1) {
                if (result1 != null) {
                    
                    db.findMany(recipe, query1, projection, function (result2) {
                        console.log("result1", result1);
                        console.log("result2", result2);
                        if (result2 != null) {
                            res.render('home', { username: result1.username, 
                                name: result1.lastname+","+result1.firstname, 
                                location: result1.location, 
                                page1: '#4a89ff', 
                                result2: result2});
                        }
                        else{
                            res.render('home', { username: result1.username, 
                                name: result1.lastname+","+result1.firstname, 
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

    searchRecipe: async function(req, res) {
        var search = req.body.search

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            try {
                var searchPreview = await recipe.find({$text: {$search: search}}).lean()
            } catch (err) {
                console.log('Error on finding recipe. Error: \n' + err)
            }

            console.log(searchPreview.length)
            if (searchPreview.length > 0) {
                console.log("Search Exist");
                res.render('search', {preview: searchPreview});
            } else {
                console.log("Search does not Exist");
                req.flash('search_error', 'Recipe not found!');
                res.redirect('search');
            }
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('search_error', messages[0]);
            console.log("Search input is required")
            res.redirect('search');
        }
    },

    viewRecipe: async function (req, res) {
        var uniqueID = req.body.uniqueID
        var recipename = req.body.recipename
        var owner = req.body.owner

        var viewRecipe = await recipe.findOne({_id: uniqueID, recipename: recipename, owner: owner}).lean();

        if(viewRecipe != null) {
            console.log("View result is displayed");
            res.render('viewRecipe', {view: viewRecipe});
        } else {
            console.log("View result is gone");
            res.redirect('search');
        }
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