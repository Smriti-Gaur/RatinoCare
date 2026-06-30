import asyncHandler from "../utils/asyncHandler.js";

import {
  createSlotService,
  getDoctorSlotsService,
  getAvailableSlotsService,
   deleteSlotService,
} from "../services/slotService.js";

export const createSlot = asyncHandler(
  async (req, res) => {

    const doctorId = req.user.id;

    const data =
      await createSlotService(
        doctorId,
        req.body
      );

    res.status(201).json(data);

  }
);

export const getDoctorSlots = asyncHandler(
  async (req, res) => {

    const data =
      await getDoctorSlotsService(
        req.params.doctorId
      );

    res.status(200).json(data);

  }
);

export const getAvailableSlots = asyncHandler(
  async (req, res) => {

    const data =
      await getAvailableSlotsService(
        req.params.doctorId
      );

    res.status(200).json(data);

  }
);

export const getMySlots = asyncHandler(
  async (req, res) => {

    const data =
      await getDoctorSlotsService(
        req.user.id
      );

    res.status(200).json(data);

  }
);

export const deleteSlot = asyncHandler(
  async (req, res) => {

    const data =
      await deleteSlotService(
        req.params.slotId,
        req.user
      );

    res.status(200).json(data);

  }
);