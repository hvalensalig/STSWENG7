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
                console.log('No Files were uploaded.');
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
            const recipe = {
                image: newImageName,
                recipename: req.body.recipe_name,
                owner: req.body.owner_name,
                minutes: req.body.recipe_minutes,
                seconds: req.body.recipe_seconds,
                ingredients: req.body.ingredients,
                amounts: req.body.amounts,
                username: req.session.username
            }

            db.insertOne(Recipe, recipe, function (flag) {

                if (flag) {
                    req.flash('success_msg', success);
                    // res.send('home', {successSubmit: success});
                    res.redirect('/home#addRecipe-container');

                }
                else{
                    req.flash('error_msg', error);
                    res.redirect('/home#addRecipe-container');
                }
            });


        } catch (error) {
            console.log("hello", error);
            req.flash('errorSubmit', error);
            res.redirect('/home', { errorSubmit: error });
        }


    },
}

module.exports = profileController;