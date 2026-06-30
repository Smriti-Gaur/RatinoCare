import express from "express";
import {
  createReport,
  getPatientReports,
  getDoctorReports,
  getReportById,
  getMyReports
} from "../controllers/reportController.js";

import {
  validateCreateReport,
  validatePatientId,
  validateDoctorId,
  validateReportId,
} from "../validators/reportValidator.js";

import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  verifyReportOwnership,
} from "../middleware/ownershipMiddleware.js";



const router = express.Router();

router.post(
  "/create",
  protect,
  authorize("doctor"),
  validateCreateReport,
  createReport
);


router.get(
  "/patient/:patientId",
  protect,
  authorize("admin"),
  validatePatientId,
  getPatientReports
);

router.get(
  "/doctor/:doctorId",
  protect,
  authorize("admin"),
  validateDoctorId,
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
  protect,
  authorize(
    "patient",
    "doctor",
    "admin"
  ),
  validateReportId,
  verifyReportOwnership,
  getReportById
);

export default router;