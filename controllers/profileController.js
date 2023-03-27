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
        const errors = [];
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
            console.log("req",req.body.ingredients);
            if (Array.isArray(req.body.ingredients)) {
                req.body.ingredients.forEach((val, key) => {
                    ingredients.push({ item: val, amount: req.body.amounts[key] })
                })
            }
            else{
                ingredients.push({item: req.body.ingredients, amount: req.body.amounts});
            }


            const recipe = {
                image: newImageName,
                recipename: req.body.recipe_name,
                owner: req.body.owner_name,
                minutes: req.body.recipe_minutes,
                seconds: req.body.recipe_seconds,
                ingredients: ingredients,
                directions: req.body.recipe_directions,
                username: req.session.username
            }

            if (recipe.recipename == "") {
                errors.push("Please input the recipe name.");
            }
            if (recipe.owner == "") {
                errors.push("Please input the recipe owner name.");
            }
            if (recipe.minutes == "" || recipe.seconds == "") {
                errors.push("Please input the recipe cooking time.");
            }
            if (recipe.ingredients == "") {
                errors.push("Please input the ingredients.");
            }
            if (recipe.directions == "") {
                errors.push("Please input the directions.");
            }
            
            db.insertOne(Recipe, recipe, function (flag) {
                const errorMsg = errors.join("\r");
                sleep(500);
                if (flag) {
                    console.log("Recipe has been added.");
                    req.flash('success_msg', success);
                    // res.send('home', {successSubmit: success});
                    res.redirect('/home#addRecipe-container');

                }
                else {
                    console.log("Please fill up everythingsss.");
                    req.flash('error_msg', errorMsg);
                    res.redirect('/home#addRecipe-container');
                }
            });

        } catch (error) {
            console.log("Please fill up everything.", error);
            req.flash('error_msg', error);
            res.redirect('/home#addRecipe-container');
        }


    },
    
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = profileController;