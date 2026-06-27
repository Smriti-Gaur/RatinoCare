import express from "express";
import {
  createSlot, 
  getDoctorSlots,
  getAvailableSlots
} from "../controllers/slotController.js";

import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.post(
    "/create",
    protect,
    authorize("doctor"),
    createSlot
);

router.get(
  "/doctor/:doctorId",
  getDoctorSlots
);

router.get(
  "/available/:doctorId",
  getAvailableSlots
);

export default router;