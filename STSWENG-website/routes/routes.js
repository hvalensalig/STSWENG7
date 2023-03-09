import { Router } from "express";
import controller from '../controllers/controller.js'

const router = Router();

router.get(`/favicon.ico`, controller.getFavicon);
router.get(`/`, controller.getStart);
router.get(`/home`, controller.getHome);
router.get(`/search`, controller.getSearch);

router.get(`/addRecipe`, controller.getAddRecipe);
router.post(`/addRecipe`, controller.postAddRecipe);

router.get(`/register`, controller.getRegister);
router.post(`/register`, controller.postRegister);

router.get(`/login`, controller.getLogin);
router.post(`/login`, controller.postLogin);

router.get(`/logout`, controller.getLogout);

export default router;