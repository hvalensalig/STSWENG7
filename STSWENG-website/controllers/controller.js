import db from '../models/db.js';
import Recipe from '../models/RecipeModel.js';

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

export default controller;