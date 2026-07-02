import express from "express";

import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  getAdminDashboard,
  getDoctorDashboard,
  getPatientDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAdminDashboard
);

router.get(
  "/doctor",
  protect,
  authorize("doctor"),
  getDoctorDashboard
);

router.get(
  "/patient",
  protect,
  authorize("patient"),
  getPatientDashboard
);

export default router;