import mongoose from "mongoose";
import Slot from "../models/Slot.js";
import User from "../models/User.js";

export const createSlot = async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a doctor",
      });
    }
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Time must be in HH:mm format (24-hour)",
      });
    }
    const existingSlots = await Slot.find({
      doctorId,
      date,
    });

    for (const slot of existingSlots) {
      if (startTime < slot.endTime && endTime > slot.startTime) {
        return res.status(400).json({
          success: false,
          message: "This slot overlaps with an existing slot",
        });
      }
    }

    const slot = await Slot.create({
      doctorId,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }

    const slots = await Slot.find({
      doctorId,
    })
      .populate("doctorId", "name email")
      .sort({
        date: 1,
      });

    res.status(200).json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }

    const slots = await Slot.find({
      doctorId,
      isBooked: false,
    })
      .populate("doctorId", "name email")
      .sort({
        date: 1,
      });

    res.status(200).json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
