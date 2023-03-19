const express = require('express');
const controller = require('../controllers/controller.js')
const { searchValidation } = require('../validators.js')

const router = express();

router.get(`/favicon.ico`, controller.getFavicon);
router.get(`/`, controller.getStart);
router.get(`/home`, controller.getHome);
router.get(`/search`, controller.getSearch);
router.post('/search', searchValidation, controller.searchRecipe);

router.get(`/addRecipe`, controller.getAddRecipe);
//router.post(`/addRecipe`, controller.postAddRecipe);

router.get(`/register`, controller.getRegister);
//router.post(`/register`, controller.postRegister);

router.get(`/login`, controller.getLogin);
router.post(`/login`, controller.postLogin);

router.get(`/logout`, controller.getLogout);

module.exports = router;