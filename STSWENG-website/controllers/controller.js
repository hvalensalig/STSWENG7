import db from '../models/db.js';
import Transaction from '../models/TransactionModel.js';

const controller = {


    getFavicon: function (req, res) {
        res.status(204);
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `index.hbs` with all
            transactions currently stored in the database.
    */
    getStart: function (req, res) {
        // your code here
        res.render('register'); // This is to load the page initially. You are expected to eventually replace this with your own code.
    },

    getHome: function (req, res) {
        // your code here
        res.render('home'); // This is to load the page initially. You are expected to eventually replace this with your own code.
    },

    getSearch: function (req, res) {
        // your code here
        res.render('search'); // This is to load the page initially. You are expected to eventually replace this with your own code.
    },

    getAddRecipe: function (req, res) {
        // your code here
        res.render('addRecipe'); // This is to load the page initially. You are expected to eventually replace this with your own code.
    },

    getRegister: function (req, res) {
        res.redirect('/login')
    },

    getLogin: function (req, res) {
        res.render('login')
    },

    getLogout: function (req, res) {
        res.redirect('/login')
    }

}

export default controller;