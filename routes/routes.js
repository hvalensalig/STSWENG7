const express = require('express');
const controller = require('../controllers/controller.js');
const profileController = require('../controllers/profileController.js');
const { searchValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/userAuth');

const router = express();

router.get(`/favicon.ico`, controller.getFavicon);
//router.get(`/`, controller.getStart);
router.get(`/`, isPublic, controller.getLogin);
router.get(`/home`, isPrivate, controller.getHome);
router.get(`/search`, isPrivate, controller.getSearch);
router.post(`/search`, isPrivate, searchValidation, controller.searchRecipe);
router.post('/view', isPrivate, controller.viewRecipe);

router.get(`/addRecipe`, isPrivate, controller.getAddRecipe);
router.post(`/addRecipe`, isPrivate, profileController.postAddRecipe);

router.get(`/register`, isPublic, controller.getRegister);
//router.post(`/register`, controller.postRegister);

router.get(`/login`, isPublic, controller.getLogin);
//router.post(`/login`, controller.postLogin);

//router.get(`/logout`, controller.getLogout);

router.get(`/editProfile`, profileController.getEditProfile);
router.post(`/editProfile`, profileController.postEditProfile);

router.get(`/deleteRecipe`, profileController.deleteRecipe);
router.get(`/recipe/:id`, profileController.showRecipe);

router.get(`/editRecipe`, profileController.getEditRecipe);
router.post(`/editRecipe`, profileController.postEditRecipe);
module.exports = router;