const db = require('../models/db.js');
const Recipe = require('../models/RecipeModel.js');
const User = require('../models/users.js');

const profileController = {

    postEditProfile: function (req, res) {
        const success = "Profile has been updated.";
        const errors = [];
        let decide = false;
        try {
            const profile = {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                location: req.body.location
            }
            if (profile.firstname != "") {
                db.updateOne(User, { username: req.session.username }, { $set: { firstname: profile.firstname } }, function(flag){
                    if(flag){
                        decide = true;
                    }
                });
            }
            if (profile.lastname != "") {
                db.updateOne(User, { username: req.session.username }, { $set: { lastname: profile.lastname } }, function(flag){
                    if(flag){
                        decide = true;
                    }
                });

            }
            if (profile.location != "") {
                db.updateOne(User, { username: req.session.username }, { $set: { location: profile.location } }, function(flag){
                    if(flag){
                        decide = true;
                    }
                });
            }
            console.log("Profile has been updated.");
            if(decide){
                req.flash('success_msg1', success);
                res.redirect('/home');
            }
            else{
                req.flash('error_msg1', "No changes were made.");
                res.redirect('/home');
            }
            

        }
        catch (error) {
            console.log("error", error);
        }
    },
    getEditProfile: function (req, res) {
        var query = { username: req.session.username };
        var projection = { _id: 0, __v: 0 };
        db.findOne(User, query, projection, function (result) {
            if (result != null) {
                res.render('editProfile', { username: result.username, firstname: result.firstname, lastname: result.lastname, location: result.location });
            }
        });
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
                //console.log("default image uploaded.");
                errors.push("Please input the recipe image.");
                //newImageName = "foodie.jfif";
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
            console.log("req", req.body.ingredients);
            if (Array.isArray(req.body.ingredients)) {
                req.body.ingredients.forEach((val, key) => {
                    ingredients.push({ item: val, amount: req.body.amounts[key] })
                })
            }
            else {
                ingredients.push({ item: req.body.ingredients, amount: req.body.amounts });
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
                console.log("Please input the recipe name.");
            }
            if (recipe.owner == "") {
                errors.push("Please input the recipe owner name.");
                console.log("Please input the recipe owner name.");
            }
            if (recipe.minutes == "" || recipe.seconds == "") {
                errors.push("Please input the recipe cooking time.");
                console.log("Please input the recipe cooking time.");
            }
            if (recipe.ingredients == "") {
                errors.push("Please input the ingredients.");
                console.log("Please input the ingredients.");
            }
            if (recipe.directions == "") {
                errors.push("Please input the directions.");
                console.log("Please input the directions.");
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

    deleteRecipe: function (req, res) {
        
    },

    viewRecipe: function(req,res){
        try{
            let recipeId = req.params.id;
        
            var query = { _id: recipeId};

            var projection = { __v: 0 };

            db.findOne(Recipe, query, projection, function(result){
                //console.log(result);
                res.render('recipePage', {recipe: result});
            });
            
            
        }catch(error){
            res.status(500).send("Error Occurred");
        }
    },

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = profileController;