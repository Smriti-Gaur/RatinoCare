import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const validateCreateReport = (
  req,
  res,
  next
) => {

  const {
    patientId,
    appointmentId,
    diagnosis,
    severity,
    recommendation,
  } = req.body;

  // Required Fields
  if (
    !patientId ||
    !appointmentId ||
    !diagnosis ||
    !severity ||
    !recommendation
  ) {
    return next(
      new ApiError(
        400,
        "All fields are required"
      )
    );
  }

  // Patient ID
  if (
    !mongoose.Types.ObjectId.isValid(
      patientId
    )
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Patient ID"
      )
    );
  }

  // Appointment ID
  if (
    !mongoose.Types.ObjectId.isValid(
      appointmentId
    )
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Appointment ID"
      )
    );
  }

  // Severity Validation
  const allowedSeverity = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative",
  ];

  if (
    !allowedSeverity.includes(severity)
  ) {
    return next(
      new ApiError(
        400,
        "Invalid severity"
      )
    );
  }

  next();

};

export const validatePatientId = (
  req,
  res,
  next
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      req.params.patientId
    )
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Patient ID"
      )
    );
  }

  next();

};

export const validateDoctorId = (
  req,
  res,
  next
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      req.params.doctorId
    )
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Doctor ID"
      )
    );
  }

  next();

};

export const validateReportId = (
  req,
  res,
  next
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      req.params.id
    )
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Report ID"
      )
    );
  }

  next();

};
