import express from "express";
import {
  createReport,
  getPatientReports,
  getDoctorReports,
  getReportById,
  downloadReportPdf,
  getMyReports
  ,searchReports
} from "../controllers/reportController.js";

import {
  validateCreateReport,
  validatePatientId,
  validateDoctorId,
  validateReportId,
} from "../validators/reportValidator.js";

import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import requireApprovedDoctor from "../middleware/doctorApprovalMiddleware.js";
import {
  verifyReportOwnership,
} from "../middleware/ownershipMiddleware.js";



const router = express.Router();

router.post(
  "/create",
  protect,
  authorize("doctor"),
  requireApprovedDoctor,
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
  requireApprovedDoctor,
  getMyReports
);

router.get("/search", protect, authorize("admin"), searchReports);

router.get(
  "/:id/pdf",
  protect,
  authorize(
    "patient",
    "doctor",
    "admin"
  ),
  requireApprovedDoctor,
  validateReportId,
  verifyReportOwnership,
  downloadReportPdf
);

router.get(
  "/:id",
  protect,
  authorize(
    "patient",
    "doctor",
    "admin"
  ),
  requireApprovedDoctor,
  validateReportId,
  verifyReportOwnership,
  getReportById
);

export default router;