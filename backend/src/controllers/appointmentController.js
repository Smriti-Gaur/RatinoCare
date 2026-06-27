import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
import User from "../models/User.js";

export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate } = req.body;

    // Check ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(patientId) ||
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Patient ID or Doctor ID",
      });
    }

    if (patientId === doctorId) {
      return res.status(400).json({
        success: false,
        message: "Patient and Doctor cannot be the same user",
      });
    }

    // Check Patient Exists
    const patientExists = await User.findById(patientId);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    if (patientExists.role !== "patient") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a patient",
      });
    }

    // Check Doctor Exists
    const doctorExists = await User.findById(doctorId);

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check Doctor Role
    if (doctorExists.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a doctor",
      });
    }

    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past",
      });
    }

    const existingAppointment = await Appointment.findOne({
      patientId,
      doctorId,
      appointmentDate,
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment already exists for this doctor on this date",
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
  .populate("patientId", "name email role")
  .populate("doctorId", "name email role")
  .populate("slotId");

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Appointment ID",
      });
    }

    const appointment = await Appointment.findById(req.params.id)
  .populate("patientId", "name email role")
  .populate("doctorId", "name email role")
  .populate("slotId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAppointmentStatus = async (
  req,
  res
) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    // Check Appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Appointment ID",
      });
    }

    // Allowed Status Values
    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status value",
      });
    }

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }
    const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

if (
  !validTransitions[
    appointment.status
  ].includes(status)
) {
  return res.status(400).json({
    success: false,
    message:
      `Cannot change appointment from ${appointment.status} to ${status}`,
  });
}

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment status updated",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getPatientAppointments = async (
  req,
  res
) => {
  try {

    const { patientId } = req.params;

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(
        patientId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Patient ID",
      });
    }

    // Check Patient Exists
    const patient = await User.findById(
      patientId
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check Role
    if (patient.role !== "patient") {
      return res.status(400).json({
        success: false,
        message:
          "Selected user is not a patient",
      });
    }

    const appointments =
      await Appointment.find({
        patientId,
      })
        .populate("patientId", "name email role")
.populate("doctorId", "name email role")
.populate("slotId").sort({
  appointmentDate: -1,
});

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getDoctorAppointments = async (
  req,
  res
) => {
  try {

    const { doctorId } = req.params;

    // Validate ID
    if (
      !mongoose.Types.ObjectId.isValid(
        doctorId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }

    // Check Doctor Exists
    const doctor = await User.findById(
      doctorId
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check Role
    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message:
          "Selected user is not a doctor",
      });
    }

    const appointments =
      await Appointment.find({
        doctorId,
      })
        .populate("patientId", "name email role")
.populate("doctorId", "name email role")
.populate("slotId")
        .sort({
          appointmentDate: 1,
        });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const cancelAppointment = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    // Validate ID
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Appointment ID",
      });
    }

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    // Business Rules
    if (
      appointment.status ===
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed appointments cannot be cancelled",
      });
    }

    if (
      appointment.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment is already cancelled",
      });
    }

   appointment.status = "cancelled";

await appointment.save();

if (appointment.slotId) {

  const slot =
    await Slot.findById(
      appointment.slotId
    );

  if (slot) {

    slot.isBooked = false;

    await slot.save();
  }
}

    res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const bookSlotAppointment = async (
  req,
  res
) => {
  try {

    const {
      patientId,
      slotId,
    } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(patientId) ||
      !mongoose.Types.ObjectId.isValid(slotId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Patient ID or Slot ID",
      });
    }

    // Check Patient
    const patient =
      await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (patient.role !== "patient") {
      return res.status(400).json({
        success: false,
        message:
          "Selected user is not a patient",
      });
    }

    // Check Slot
    const slot =
      await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    const today = new Date();
today.setHours(0, 0, 0, 0);

const slotDate = new Date(slot.date);
slotDate.setHours(0, 0, 0, 0);

if (slotDate < today) {
  return res.status(400).json({
    success: false,
    message: "Cannot book past slots",
  });
}

    // Slot Already Booked
    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message:
          "Slot already booked",
      });
    }

    // Prevent Duplicate Booking
    const existingAppointment =
      await Appointment.findOne({
        patientId,
        slotId,
      });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment already exists for this slot",
      });
    }

    const appointment =
      await Appointment.create({

        patientId,

        doctorId:
          slot.doctorId,

        slotId,

        appointmentDate:
          slot.date,

      });

    // Mark Slot Booked
    slot.isBooked = true;

    await slot.save();

    res.status(201).json({
      success: true,
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getMyAppointments = async (
  req,
  res
) => {
  try {

    let query = {};

    if (req.user.role === "patient") {
      query.patientId = req.user.id;
    }

    else if (req.user.role === "doctor") {
      query.doctorId = req.user.id;
    }

    else {
      return res.status(403).json({
        success: false,
        message: "Invalid role",
      });
    }

    const appointments =
      await Appointment.find(query)
        .populate(
          "patientId",
          "name email role"
        )
        .populate(
          "doctorId",
          "name email role"
        )
        .populate("slotId")
        .sort({
          appointmentDate: -1,
        });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
