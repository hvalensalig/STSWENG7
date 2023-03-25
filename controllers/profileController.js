const db = require('../models/db.js');
const Recipe = require('../models/RecipeModel.js');
const User = require('../models/users.js');

const profileController = {

    updateProfile: function (req, res) {
    },
    getRecipes: function (req, res) {

    },
    postAddRecipe: function (req, res) {
        const success = "Recipe has been added.";
        const error = "Please fill up everything.";
        try {
            let imageUploadFile;
            let uploadPath;
            let newImageName;
            if (!req.files || Object.keys(req.files).length === 0) {
                console.log("default image uploaded.");
                newImageName = "foodie.jfif";
            } else {
                console.log("reqbody", req.body);
                imageUploadFile = req.files.recipe_image;
                newImageName = Date.now() + imageUploadFile.name;
                uploadPath = require('path').resolve('./') + '/public/images/' + newImageName;
                imageUploadFile.mv(uploadPath, function (err) {
                    if (err) return res.status(500).send(err);
                })
            }
            //console.log("reqbody", req.body);
            var ingredients = []
            req.body.ingredients.forEach((val, key) => {
                ingredients.push({item: val, amount: req.body.amounts[key]})
            })

            const recipe = {
                image: newImageName,
                recipename: req.body.recipe_name,
                owner: req.body.owner_name,
                minutes: req.body.recipe_minutes,
                seconds: req.body.recipe_seconds,
                ingredients: ingredients,
                amounts: req.body.amounts,
                username: req.session.username
            }

            db.insertOne(Recipe, recipe, function (flag) {

                if (flag) {
                    console.log("Recipe has been added.");
                    req.flash('success_msg', success);
                    // res.send('home', {successSubmit: success});
                    res.redirect('/home#addRecipe-container');

                }
                else{
                    console.log("Please fill up everything.");
                    req.flash('error_msg', error);
                    res.redirect('/home#addRecipe-container');
                }
            });

        } catch (error) {
            console.log("Please fill up everything.");
            req.flash('error_msg', this.error);
            res.redirect('/home#addRecipe-container');
        }


    },
}

module.exports = profileController;