import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createDoctorLicense,
  disableDoctorLicense,
  getDoctorLicenses,
} from "../controllers/doctorLicenseController.js";
import {
  validateCreateLicense,
  validateLicenseId,
} from "../validators/doctorLicenseValidator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.post("/", validateCreateLicense, createDoctorLicense);
router.get("/", getDoctorLicenses);
router.patch("/:id/disable", validateLicenseId, disableDoctorLicense);

export default router;
