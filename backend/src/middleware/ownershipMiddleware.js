import Report from "../models/Report.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const resolveUserId = async (publicOrObjectId) => {
  const query = [{ publicId: publicOrObjectId }];
  if (mongoose.Types.ObjectId.isValid(publicOrObjectId)) query.push({ _id: publicOrObjectId });
  const user = await User.findOne({ $or: query }).select("_id");
  return user?._id?.toString();
};

export const verifyPatientOwnership = async (
  req,
  res,
  next
) => {

  // Admin can access everything
  if (req.user.role === "admin") {
    return next();
  }

  // Patient can access only own data
  if (
    req.user.role === "patient" &&
    req.user.id === await resolveUserId(req.params.patientId)
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied",
  });

};

export const verifyDoctorOwnership = async (
  req,
  res,
  next
) => {

  // Admin
  if (req.user.role === "admin") {
    return next();
  }

  if (
    req.user.role === "doctor" &&
    req.user.id === await resolveUserId(req.params.doctorId)
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only access your own data",
  });

};

export const verifyReportOwnership = async (
  req,
  res,
  next
) => {
  try {

    const reportQuery = [{ publicId: req.params.id }];
    if (mongoose.Types.ObjectId.isValid(req.params.id)) reportQuery.push({ _id: req.params.id });
    const report = await Report.findOne({ $or: reportQuery });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Doctor can access only reports they created
    if (
      req.user.role === "doctor" &&
      report.doctorId.toString() === req.user.id
    ) {
      return next();
    }

    // Patient can access only their own reports
    if (
      req.user.role === "patient" &&
      report.patientId.toString() === req.user.id
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};