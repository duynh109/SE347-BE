import express from 'express'
const router=express.Router()
import * as reviewController from '../controller/reviewController.js'

router.get("/danhgia",reviewController.getAllDG)
router.post("/danhgia",reviewController.createDanhGia)
router.put("/danhgia/:id",reviewController.updateDanhGia)
router.delete("/danhgia/:id",reviewController.deleteDanhGia)
router.get("/danhgia/:id",reviewController.getDGBySP)

export default router;