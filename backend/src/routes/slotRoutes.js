import express from "express";
import {
  createSlot,
  getDoctorSlots,
  getAvailableSlots,
  getMySlots,
  deleteSlot,
} from "../controllers/slotController.js";
import {
  validateCreateSlot,
  validateDoctorId,
  validateSlotId,
} from "../validators/slotValidator.js";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import requireApprovedDoctor from "../middleware/doctorApprovalMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  authorize("doctor"),
  requireApprovedDoctor,
  validateCreateSlot,
  createSlot
);

router.get(
  "/my-slots",
  protect,
  authorize("doctor"),
  requireApprovedDoctor,
  getMySlots
);

router.get(
  "/doctor/:doctorId",
  protect,
 authorize("admin"),
  validateDoctorId,
  getDoctorSlots
);
router.get(
  "/available/:doctorId",
  protect,
  authorize("patient", "admin"),
  getAvailableSlots,
);

router.delete(
  "/:slotId",
  protect,
  authorize("doctor","admin"),
  requireApprovedDoctor,
  validateSlotId,
  deleteSlot
);

export default router;
