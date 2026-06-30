import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const validateCreateSlot = (
  req,
  res,
  next
) => {

  const {
    date,
    startTime,
    endTime,
  } = req.body;

  // Required Fields
  if (
    !date ||
    !startTime ||
    !endTime
  ) {
    return next(
      new ApiError(
        400,
        "Date, Start Time and End Time are required"
      )
    );
  }

  // Date Format
  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return next(
      new ApiError(
        400,
        "Invalid date"
      )
    );
  }

  // Past Date Check
  selectedDate.setHours(0,0,0,0);

  const today = new Date();
  today.setHours(0,0,0,0);

  if (selectedDate < today) {
    return next(
      new ApiError(
        400,
        "Slot date cannot be in the past"
      )
    );
  }

  // HH:mm Validation
  const timeRegex =
    /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (
    !timeRegex.test(startTime) ||
    !timeRegex.test(endTime)
  ) {
    return next(
      new ApiError(
        400,
        "Time must be in HH:mm format (24-hour)"
      )
    );
  }

  // Start < End
  if (startTime >= endTime) {
    return next(
      new ApiError(
        400,
        "End time must be after start time"
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

  const { doctorId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      doctorId
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

export const validateSlotId = (
  req,
  res,
  next
) => {

  const { slotId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      slotId
    )
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