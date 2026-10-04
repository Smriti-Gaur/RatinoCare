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

import {

validateCreateAppointment,
validateAppointmentId,
validatePatientId,
validateDoctorId,
validateStatusUpdate,
validateBookSlot,
} from "../validators/appointmentValidator.js";

import {verifyPatientOwnership , verifyDoctorOwnership }from "../middleware/ownershipMiddleware.js";


import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import requireApprovedDoctor from "../middleware/doctorApprovalMiddleware.js";

const router = express.Router();

router.post(
    "/create",
        protect,
        authorize("patient"),
    validateCreateAppointment,
    createAppointment
);
router.get(
  "/",protect,
    authorize("admin"),
    getAllAppointments
);

router.post(
    "/book-slot",
    protect,
    authorize("patient"),
    validateBookSlot,
    bookSlotAppointment
);

router.get(
  "/my-appointments",
  protect,
    authorize("patient", "doctor", "admin"),
    requireApprovedDoctor,
    getMyAppointments
);

router.get(
    "/patient/:patientId",
    protect,
    authorize("patient","admin"),
    validatePatientId,
    verifyPatientOwnership,
    getPatientAppointments
);

router.get(
    "/doctor/:doctorId",
    protect,
    authorize("doctor","admin"),
    requireApprovedDoctor,
    validateDoctorId,
    verifyDoctorOwnership,
    getDoctorAppointments
);



router.get(
    "/:id",
    protect,
    requireApprovedDoctor,
    validateAppointmentId,
    getAppointmentById
);
router.patch(
    "/:id/status",
    protect,
    authorize("doctor"),
    requireApprovedDoctor,
    validateAppointmentId,
    validateStatusUpdate,
    updateAppointmentStatus
);

router.patch(
    "/:id/cancel",
    protect,
    authorize("doctor"),
    requireApprovedDoctor,
    validateAppointmentId,
    cancelAppointment
);

export default router;
