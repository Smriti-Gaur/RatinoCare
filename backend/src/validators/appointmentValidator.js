import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const validateCreateAppointment = (
  req,
  res,
  next
) => {

  const {
    patientId,
    doctorId,
    appointmentDate,
  } = req.body;

  if (
    !patientId ||
    !doctorId ||
    !appointmentDate
  ) {
    return next(
      new ApiError(
        400,
        "Patient ID, Doctor ID and Appointment Date are required"
      )
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(patientId)
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Patient ID"
      )
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(doctorId)
  ) {
    return next(
      new ApiError(
        400,
        "Invalid Doctor ID"
      )
    );
  }

  const selectedDate = new Date(appointmentDate);

  if (isNaN(selectedDate.getTime())) {
    return next(
      new ApiError(
        400,
        "Invalid appointment date"
      )
    );
  }

  selectedDate.setHours(0,0,0,0);

  const today = new Date();

  today.setHours(0,0,0,0);

  if(selectedDate < today){

    return next(
      new ApiError(
        400,
        "Appointment date cannot be in the past"
      )
    );

  }

  next();

};

export const validateAppointmentId = (
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
        "Invalid Appointment ID"
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

export const validateStatusUpdate = (
  req,
  res,
  next
) => {

  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];

  if (!status) {

    return next(
      new ApiError(
        400,
        "Status is required"
      )
    );

  }

  if (
    !allowedStatuses.includes(status)
  ) {

    return next(
      new ApiError(
        400,
        "Invalid status"
      )
    );

  }

  next();

};

export const validateBookSlot = (
  req,
  res,
  next
) => {

  const { slotId } = req.body;

  if (!slotId) {

    return next(
      new ApiError(
        400,
        "Slot ID is required"
      )
    );

  }

  if (
    !mongoose.Types.ObjectId.isValid(slotId)
  ) {

    return next(
      new ApiError(
        400,
        "Invalid Slot ID"
      )
    );

  }

  next();

};

