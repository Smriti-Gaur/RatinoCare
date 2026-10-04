import express from "express";
import {
  getAllDoctors,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "../controllers/doctorController.js";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  validateDoctorId,
  validateRejection,
} from "../validators/doctorApprovalValidator.js";

const router =
  express.Router();

router.get(
  "/",
  getAllDoctors
);

router.get("/pending", protect, authorize("admin"), getPendingDoctors);
router.patch(
  "/:doctorId/approve",
  protect,
  authorize("admin"),
  validateDoctorId,
  approveDoctor
);
router.patch(
  "/:doctorId/reject",
  protect,
  authorize("admin"),
  validateDoctorId,
  validateRejection,
  rejectDoctor
);

export default router;