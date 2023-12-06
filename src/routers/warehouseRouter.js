import express from 'express'
const router=express.Router()
import * as warehouseController from '../controller/warehouseController.js'

router
    .get("/warehouse", warehouseController.getAllTonKho)
    .get("/warehouse/:id", warehouseController.getTonKhoById)
    .get("/warehouse/thang/:thang", warehouseController.getTonKhoByThang)
    .post("/warehouse", warehouseController.addTonKho)
    .put("/warehouse/:id", warehouseController.updateTonKho)
    .delete("/warehouse/:id", warehouseController.deleteTonKho);

export default router