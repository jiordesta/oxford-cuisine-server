import { Router } from "express";
import { create_product, delete_product, fetch_products, update_product } from "../controllers/product_controller.js";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.route('/create_product').post(upload.single(''),create_product)
router.route('/fetch_products').get(fetch_products)
router.route('/update_product/:id').patch(upload.single(''), update_product)
router.route('/delete_product/:id').delete(delete_product)

export default router