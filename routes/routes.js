const express = require('express');
const controller = require('../controllers/controller.js')
const { isPublic, isPrivate } = require('../middlewares/userAuth');

const router = express();

router.get(`/favicon.ico`, controller.getFavicon);
//router.get(`/`, controller.getStart);
router.get(`/`, isPublic, controller.getLogin);
router.get(`/home`, isPrivate, controller.getHome);
router.get(`/search`, isPrivate, controller.getSearch);

router.get(`/addRecipe`, isPrivate, controller.getAddRecipe);
//router.post(`/addRecipe`, controller.postAddRecipe);

router.get(`/register`, isPublic, controller.getRegister);
//router.post(`/register`, controller.postRegister);

router.get(`/login`, isPublic, controller.getLogin);
//router.post(`/login`, controller.postLogin);

//router.get(`/logout`, controller.getLogout);

module.exports = router;