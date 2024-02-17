import { Router } from "express";
import { delete_user, fetch_user, login, logout, register } from "../controllers/user_controller.js";
import { upload } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";
const router = Router();

router.route('/register').post(upload.single("image"), register)
router.route('/login').post(upload.single(''), login)
router.route('/logout').patch(logout)
router.route('/fetch_user').get(authenticate, fetch_user)
router.route('/delete_user/:id').delete(authenticate, delete_user)

export default router;