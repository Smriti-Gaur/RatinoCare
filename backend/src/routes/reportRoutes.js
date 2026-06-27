import express from "express";
import {
  createReport,
  getPatientReports,
  getDoctorReports,
  getReportById,
  getMyReports
} from "../controllers/reportController.js";

import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/create",
    protect,
    authorize("doctor"),
    createReport
);



router.get(
  "/patient/:patientId",
  getPatientReports
);

router.get(
  "/doctor/:doctorId",
  getDoctorReports
);

router.get(
  "/my-reports",
  protect,
  authorize("patient", "doctor"),
  getMyReports
);

router.get(
  "/:id",
  getReportById
);

export default router;