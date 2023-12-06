import express from "express";
const router = express.Router();
import * as ServiceTypeController from "../controller/serviceTypeController.js";

router
  .get("/serviceType", ServiceTypeController.getAllServiceType)
  .get("/serviceType/:id", ServiceTypeController.getServiceTypeById)
  .get("/serviceType/svtid/:svt_id", ServiceTypeController.getServiceTypeBySVTID)
  .post("/serviceType", ServiceTypeController.addServiceType)
  .put("/serviceType/:id", ServiceTypeController.updateServiceType)
  .put("/serviceType/svtid/:svt_id", ServiceTypeController.updateServiceTypeBySVTID)
  .delete("/serviceType/:id", ServiceTypeController.deleteServiceType)
  .delete("/serviceType/svtid/:svt_id", ServiceTypeController.deleteServiceTypeBySVTID);

export default router;
