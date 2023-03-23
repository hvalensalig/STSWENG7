const db = require('../models/db.js');
const recipe = require('../models/RecipeModel.js');
const { validationResult } = require('express-validator');

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },
    getStart: function (req, res) {
        res.render('login'); 
    },

    getHome: function (req, res) {
        res.render('home'); 
    },

    getSearch: function (req, res) {
        res.render('search');
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

            if (searchPreview.length > 0) {
                res.render('search', {preview: searchPreview})
            } else {
                req.flash('search_error', 'Recipe not found!');
                res.redirect('search');
            }
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('search_error', messages[0]);
            res.redirect('search');
        }
    },

    viewRecipe: async function (req, res) {
        var recipename = req.body.recipename
        var owner = req.body.owner

        var viewRecipe = await recipe.findOne({recipename: recipename, owner: owner}).lean();

        console.log(viewRecipe)
        res.render('viewRecipe', {view: viewRecipe});
    },

    getAddRecipe: function (req, res) {

        res.render('addRecipe'); 
    },

    postAddRecipe: function (req, res) {

        res.redirect('home'); 
    },

    getRegister: function (req, res) {
        res.render('register');
    },

    postRegister: function(req,res){
        res.redirect('/login');
    },

    getLogin: function (req, res) {
        res.render('login');
    },

    postLogin: function(req,res){
        res.redirect('/home');
    },

    getLogout: function (req, res) {
        res.redirect('/login');
    },

}

module.exports = controller;