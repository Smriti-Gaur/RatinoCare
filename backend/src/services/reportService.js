import mongoose from "mongoose";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const findReport = (id) => {
  const query = [{ publicId: id }];
  if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
  return Report.findOne({ $or: query });
};
const findUserByPublicOrObjectId = async (id) => {
  const query = [{ publicId: id }];
  if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
  return User.findOne({ $or: query });
};

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
  const appointmentQuery = [{ publicId: appointmentId }];
  if (mongoose.Types.ObjectId.isValid(appointmentId)) appointmentQuery.push({ _id: appointmentId });
  const appointment = await Appointment.findOne({ $or: appointmentQuery });

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

  const patient = await findUserByPublicOrObjectId(patientId);
  const doctor = await findUserByPublicOrObjectId(doctorId);
  if (!patient || patient.role !== "patient") throw new ApiError(404, "Patient not found");
  if (!doctor || doctor.role !== "doctor") throw new ApiError(404, "Doctor not found");

  // Validate Patient
  if (
    appointment.patientId.toString() !== patient._id.toString()
  ) {
    throw new ApiError(
      400,
      "Patient does not belong to this appointment"
    );
  }

  // Validate Doctor
  if (
    appointment.doctorId.toString() !== doctor._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not assigned to this appointment"
    );
  }

  const report =
    await Report.create({
      patientId: patient._id,
      doctorId: doctor._id,
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

  const patient = await findUserByPublicOrObjectId(patientId);
  if (!patient || patient.role !== "patient") throw new ApiError(404, "Patient not found");

  const reports = await Report.find({ patientId: patient._id })
    .populate("patientId", "publicId name email role")
    .populate("doctorId", "publicId name email role")
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

  const doctor = await findUserByPublicOrObjectId(doctorId);
  if (!doctor || doctor.role !== "doctor") throw new ApiError(404, "Doctor not found");

  const reports = await Report.find({ doctorId: doctor._id })
    .populate("patientId", "publicId name email role")
    .populate("doctorId", "publicId name email role")
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
    await findReport(id)
      .populate("patientId", "publicId name email role")
      .populate("doctorId", "publicId name email role")
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
    .populate("patientId", "publicId name email role")
    .populate("doctorId", "publicId name email role")
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

export const searchReportsService = async (keyword) => {
  const value = keyword?.trim();
  if (!value) return { success: true, count: 0, reports: [] };

  const people = await User.find({
    $or: [
      { publicId: { $regex: value, $options: "i" } },
      { name: { $regex: value, $options: "i" } },
    ],
  }).select("_id");
  const query = {
    $or: [
      { publicId: { $regex: value, $options: "i" } },
      { patientId: { $in: people.map((person) => person._id) } },
      { doctorId: { $in: people.map((person) => person._id) } },
    ],
  };
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    query.$or.push({ createdAt: { $gte: date, $lt: nextDate } });
  }

  const reports = await Report.find(query)
    .populate("patientId", "publicId name email role")
    .populate("doctorId", "publicId name email role")
    .populate("appointmentId")
    .sort({ createdAt: -1 });

  return { success: true, count: reports.length, reports };
};