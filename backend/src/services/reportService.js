import mongoose from "mongoose";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";
import ApiError from "../utils/ApiError.js";

export const createReportService = async (
  doctorId,
  reportData
) => {

  const {
    patientId,
    appointmentId,
    diagnosis,
    severity,
    recommendation,
  } = reportData;

  // Check Appointment Exists
  const appointment =
    await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(
      404,
      "Appointment not found"
    );
  }

  // Appointment must be completed
  if (appointment.status !== "completed") {
    throw new ApiError(
      400,
      "Report can only be created for completed appointments"
    );
  }

  // One report per appointment
  const existingReport =
    await Report.findOne({
      appointmentId,
    });

  if (existingReport) {
    throw new ApiError(
      400,
      "Report already exists for this appointment"
    );
  }

  // Validate Patient
  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new ApiError(
      400,
      "Patient does not belong to this appointment"
    );
  }

  // Validate Doctor
  if (
    appointment.doctorId.toString() !==
    doctorId
  ) {
    throw new ApiError(
      403,
      "You are not assigned to this appointment"
    );
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

  return {
    success: true,
    report,
  };

};

export const getPatientReportsService = async (
  patientId
) => {

  const reports = await Report.find({
    patientId,
  })
    .populate("patientId", "name email role")
    .populate("doctorId", "name email role")
    .populate("appointmentId")
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    count: reports.length,
    reports,
  };

};

export const getDoctorReportsService = async (
  doctorId
) => {

  const reports = await Report.find({
    doctorId,
  })
    .populate("patientId", "name email role")
    .populate("doctorId", "name email role")
    .populate("appointmentId")
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    count: reports.length,
    reports,
  };

};

export const getReportByIdService = async (
  id
) => {

  const report =
    await Report.findById(id)
      .populate("patientId", "name email role")
      .populate("doctorId", "name email role")
      .populate("appointmentId");

  if (!report) {
    throw new ApiError(
      404,
      "Report not found"
    );
  }

  return {
    success: true,
    report,
  };

};

export const getMyReportsService = async (
  user
) => {

  let query = {};

  if (user.role === "patient") {
    query.patientId = user.id;
  }

  else if (user.role === "doctor") {
    query.doctorId = user.id;
  }

  else {
    throw new ApiError(
      403,
      "Invalid Role"
    );
  }

  const reports = await Report.find(query)
    .populate("patientId", "name email role")
    .populate("doctorId", "name email role")
    .populate("appointmentId")
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    count: reports.length,
    reports,
  };

};