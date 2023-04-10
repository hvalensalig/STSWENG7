const db = require('../models/db.js');
const Recipe = require('../models/RecipeModel.js');
const User = require('../models/users.js');
const fs = require('fs');
const profileController = {

    postEditProfile: function (req, res) {
        const success = "Profile has been updated.";
        const errors = [];
        let decide = false;
        try {
            const profile = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                location: req.body.location
            }
            
            if (profile.firstname != "") {
                if(profile.firstname != req.body.oldfirstname){
                    decide = true;
                }
                db.updateOne(User, { username: req.session.username }, { $set: { firstname: profile.firstname } }, function (flag) {
                    if (flag) {
                        
                    }
                });
            }
            if (profile.lastname != "") {
                if(profile.lastname != req.body.oldlastname){
                    decide = true;
                }
                db.updateOne(User, { username: req.session.username }, { $set: { lastname: profile.lastname } }, function (flag) {
                    if (flag) {
                        
                    }
                });
            }
            if (profile.location != "") {
                if(profile.location != req.body.oldlocation){
                    decide = true;
                }
                db.updateOne(User, { username: req.session.username }, { $set: { location: profile.location } }, function (flag) {
                    if (flag) {
                        
                    }
                });
            }

            console.log("Profile has been updated.");
            if (decide) {
                req.flash('success_msg1', success);
                res.redirect('/home');
            }
            else {
                req.flash('error_msg1', "No changes were made.");
                res.redirect('/home');
            }


        }
        catch (error) {
            console.log("An error has occur profile update failed.");
            //because of differnt version we cannot use error.toString()
            req.flash('error_msg1', "TypeError: Cannot read properties of undefined (reading 'username')");
            res.redirect('/home');
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
                console.log("Please input the recipe image")
                errors.push("Please input the recipe image.");
                //newImageName = "foodie.jfif";
            } else {
                //console.log("reqbody", req.body);
                imageUploadFile = req.files.recipe_image;
                newImageName = Date.now() + imageUploadFile.name;
            }
            //console.log("reqbody", req.body);
            var ingredients = []
            //console.log("req", req.body.ingredients);
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
                    uploadPath = require('path').resolve('./') + '/public/images/' + newImageName;
                    imageUploadFile.mv(uploadPath, function (err) {
                        if (err) return res.status(500).send(err);
                    })
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
            console.log("Please fill up everything.", error.toString());
            req.flash('error_msg', error.toString());
            res.redirect('/home#addRecipe-container');
        }


    },

    deleteRecipe: function (req, res) {
        try {
            let recipeId = req.query.id;

            var query = { _id: recipeId };

            var projection = { __v: 0 };
            let imageUploadFile;
            let uploadPath;
            console.log("inside delete");
            db.findOne(Recipe, query, projection, function (result) {
                if (result != null) {
                    db.deleteOne(Recipe, query, function (flag) {
                        imageUploadFile = result.image;
                        uploadPath = require('path').resolve('./') + '/public/images/' + imageUploadFile;
                        require('fs').unlink(uploadPath, function (err) {
                            if (err) return res.status(500).send(err);
                        })

                        res.redirect('home');
                    });

                }
            });




        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    showRecipe: function (req, res) {
        try {
            let recipeId = req.params.id;

            var query = { _id: recipeId };

            var projection = { __v: 0 };

            db.findOne(Recipe, query, projection, function (result) {
                //console.log(result);
                res.render('recipePage', { recipe: result });
            });


        } catch (error) {
            res.status(500).send("Error Occurred");
        }
    },

    getEditRecipe: function (req, res) {
        try {

            let recipeId = req.query.idname;
            console.log("recipeid", recipeId);
            var query = { _id: recipeId };

            var projection = { __v: 0 };

            db.findOne(Recipe, query, projection, function (result) {
                console.log(result);
                res.render('editRecipe', { recipe: result });
            });


        } catch (error) {
            res.status(500).send("Error Occurred");
        }
    },
    postEditRecipe: function (req, res) {
        try {
            const success = "Recipe has been added.";
            const errors = [];
            let imageUploadFile;
            let imageUploadFileold;
            let uploadPath;
            let newImageName;
    
            if (!req.files || Object.keys(req.files).length === 0) {
                console.log("im inside image if");
            } else {
                imageUploadFile = req.files.recipe_image;
                newImageName = Date.now() + imageUploadFile.name;
            }

            var ingredients = [];
            console.log("req", req.body);
            if (Array.isArray(req.body.ingredients)) {
                req.body.ingredients.forEach((val, key) => {
                    ingredients.push({ item: val, amount: req.body.amounts[key] })
                })
            }
            else {
                ingredients.push({ item: req.body.ingredients, amount: req.body.amounts });
            }
            console.log("req1", req.body);
            const recipe = {
                image: newImageName,
                recipename: req.body.recipename,
                owner: req.body.owner,
                minutes: req.body.minutes,
                seconds: req.body.seconds,
                ingredients: ingredients,
                directions: req.body.directions,
                username: req.session.username
            }
            var query = { _id: req.body.recipeId };
            if (recipe.image != "" && recipe.image != undefined) {
                console.log("asdfasdf");
                imageUploadFileold = req.body.recipe_oldimage;
                uploadPath = require('path').resolve('./') + '/public/images/' + imageUploadFileold;
                require('fs').unlink(uploadPath, function (err) {
                    if (err) return res.status(500).send(err);
                })

                db.updateOne(Recipe, query, { $set: { image: recipe.image } }, function (flag) {
                    if (flag) {
                        uploadPath = require('path').resolve('./') + '/public/images/' + newImageName;
                        imageUploadFile.mv(uploadPath, function (err) {
                            if (err) return res.status(500).send(err);
                        })
                    }
                });
            }

            if (recipe.recipename != "") {
                db.updateOne(Recipe, query, { $set: { recipename: recipe.recipename } }, function (flag) {
                    if (flag) {

                    }
                });
            }
            if (recipe.owner != "") {
                db.updateOne(Recipe, query, { $set: { owner: recipe.owner } }, function (flag) {
                    if (flag) {

                    }
                });
            }
            if (recipe.minutes != "") {
                db.updateOne(Recipe, query, { $set: { minutes: recipe.minutes } }, function (flag) {
                    if (flag) {

                    }
                });
            }
            if (recipe.seconds != "") {
                db.updateOne(Recipe, query, { $set: { seconds: recipe.seconds } }, function (flag) {
                    if (flag) {

                    }
                });
            }

            if (Array.isArray(req.body.ingredients)) {
                if (recipe.ingredients[0].amount != undefined && recipe.ingredients[0].item != undefined) {
                    console.log("i am in");
                    db.updateOne(Recipe, query, { $set: { ingredients: recipe.ingredients } }, function (flag) {
                        if (flag) {
    
                        }
                    });
                }
            }
            else {
                if (recipe.ingredients[0].amount != undefined && recipe.ingredients[0].amount != "" && recipe.ingredients[0].item != undefined && recipe.ingredients[0].amount != undefined) {
                    console.log("i am inhere");
                    db.updateOne(Recipe, query, { $set: { ingredients: recipe.ingredients } }, function (flag) {
                        if (flag) {
    
                        }
                    });
                }
            }


            if (recipe.directions != "") {
                db.updateOne(Recipe, query, { $set: { directions: recipe.directions } }, function (flag) {
                    if (flag) {

                    }
                });
            }


            res.redirect('/home');

        } catch (error) {
            res.status(500).send("Error Occurred");
        }
    },

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = profileController;