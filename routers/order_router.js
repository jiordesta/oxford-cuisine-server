import { Router } from "express";
import { create_order, fetch_my_orders, fetch_orders, update_status } from "../controllers/order_controller.js";
import { upload } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = Router()

router.route('/create_order').post(upload.single(),authenticate,create_order)
router.route('/fetch_my_orders').get(authenticate, fetch_my_orders)
router.route('/fetch_orders').get(authenticate, fetch_orders)
router.route('/update_status/:id').patch(upload.single() ,authenticate, update_status)

export default router