import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  bookSlotAppointment,
  getMyAppointments
} from "../controllers/appointmentController.js";

import {verifyPatientOwnership , verifyDoctorOwnership }from "../middleware/ownershipMiddleware.js";

import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/book-slot",
  bookSlotAppointment
);

router.post(
  "/create",
  createAppointment
);
router.get(
  "/",protect,
  getAllAppointments
);

router.post(
    "/book-slot",
    protect,
    authorize("patient"),
    bookSlotAppointment
);

router.get(
  "/my-appointments",
  protect,
  authorize("patient", "doctor"),
  getMyAppointments
);

router.get(
    "/patient/:patientId",
    protect,
    authorize("patient","admin"),
    verifyPatientOwnership,
    getPatientAppointments
);

router.get(
  "/doctor/:doctorId",
  protect,
  authorize("doctor", "admin"),
  verifyDoctorOwnership,
  getDoctorAppointments
);



router.get("/:id", getAppointmentById);

router.patch(
    "/:id/status",
    protect,
    authorize("doctor"),
    updateAppointmentStatus
);

router.patch(
    "/:id/cancel",
    protect,
    authorize("patient", "doctor"),
    cancelAppointment
);

export default router;

