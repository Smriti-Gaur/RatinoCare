import mongoose from "mongoose";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";

export const createReport = async (req, res) => {
  try {

    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      severity,
      recommendation,
    } = req.body;

    // Validate Appointment ID
    if (
      !mongoose.Types.ObjectId.isValid(
        appointmentId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Appointment ID",
      });
    }

    // Check Appointment Exists
    const appointment =
      await Appointment.findById(
        appointmentId
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only completed appointments
    if (
      appointment.status !==
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Report can only be created for completed appointments",
      });
    }

    // One report per appointment
    const existingReport =
      await Report.findOne({
        appointmentId,
      });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message:
          "Report already exists for this appointment",
      });
    }

    // Match Patient
    if (
      appointment.patientId.toString() !==
      patientId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient does not belong to this appointment",
      });
    }

    // Match Doctor
    if (
      appointment.doctorId.toString() !==
      doctorId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor does not belong to this appointment",
      });
    }

    const report =
      await Report.create({
        patientId,
        doctorId,
        appointmentId,
        diagnosis,
        severity,
        recommendation,
      });

    res.status(201).json({
      success: true,
      report,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getPatientReports = async (
  req,
  res
) => {
  try {

    const { patientId } = req.params;

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

    const reports =
      await Report.find({
        patientId,
      })
        .populate(
          "patientId",
          "name email role"
        )
        .populate(
          "doctorId",
          "name email role"
        )
        .populate(
          "appointmentId"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getDoctorReports = async (
  req,
  res
) => {
  try {

    const { doctorId } = req.params;

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

    const reports =
      await Report.find({
        doctorId,
      })
        .populate(
          "patientId",
          "name email role"
        )
        .populate(
          "doctorId",
          "name email role"
        )
        .populate(
          "appointmentId"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getReportById = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Report ID",
      });
    }

    const report =
      await Report.findById(id)
        .populate(
          "patientId",
          "name email role"
        )
        .populate(
          "doctorId",
          "name email role"
        )
        .populate(
          "appointmentId"
        );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getMyReports = async (
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

    const reports = await Report.find(query)
      .populate(
        "patientId",
        "name email role"
      )
      .populate(
        "doctorId",
        "name email role"
      )
      .populate("appointmentId")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};