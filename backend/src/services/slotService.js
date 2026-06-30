import mongoose from "mongoose";
import Slot from "../models/Slot.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const createSlotService = async (
  doctorId,
  slotData
) => {

  const { date, startTime, endTime } = slotData;


  // Check Doctor Exists
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }


  // Check Overlapping Slots
  const existingSlots = await Slot.find({
    doctorId,
    date,
  });

  for (const slot of existingSlots) {

    if (
      startTime < slot.endTime &&
      endTime > slot.startTime
    ) {
      throw new ApiError(
        400,
        "This slot overlaps with an existing slot"
      );
    }

  }

  // Create Slot
  const slot = await Slot.create({
    doctorId,
    date,
    startTime,
    endTime,
  });

  return {
    success: true,
    slot,
  };

};

export const getDoctorSlotsService = async (
  doctorId
) => {


  const slots = await Slot.find({
    doctorId,
  })
    .populate("doctorId", "name email")
    .sort({
      date: 1,
    });

  return {
    success: true,
    count: slots.length,
    slots,
  };

};

export const getAvailableSlotsService = async (
  doctorId
) => {


  const slots = await Slot.find({
    doctorId,
    isBooked: false,
  })
    .populate("doctorId", "name email")
    .sort({
      date: 1,
    });

  return {
    success: true,
    count: slots.length,
    slots,
  };

};

export const deleteSlotService = async (
  slotId,
  user
) => {


  const slot = await Slot.findById(slotId);

  if (!slot) {
    throw new ApiError(
      404,
      "Slot not found"
    );
  }

  // Booked slots cannot be deleted
  if (slot.isBooked) {
    throw new ApiError(
      400,
      "Booked slots cannot be deleted"
    );
  }

  // Doctor can delete only their own slots
  if (
    user.role === "doctor" &&
    slot.doctorId.toString() !== user.id
  ) {
    throw new ApiError(
      403,
      "You can delete only your own slots"
    );
  }

  await Slot.findByIdAndDelete(slotId);

  return {
    success: true,
    message: "Slot deleted successfully",
  };

};