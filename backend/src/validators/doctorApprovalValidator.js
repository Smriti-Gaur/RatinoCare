import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const validateDoctorId = (req, res, next) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.doctorId) &&
    !/^RC-DOC-\d{6}$/.test(req.params.doctorId)
  ) {
    return next(new ApiError(400, "Invalid doctor ID"));
  }

  next();
};

export const validateRejection = (req, res, next) => {
  if (typeof req.body.reason !== "string" || !req.body.reason.trim()) {
    return next(new ApiError(400, "A rejection reason is required"));
  }

  if (req.body.reason.trim().length > 500) {
    return next(new ApiError(400, "Rejection reason must be 500 characters or fewer"));
  }

  next();
};
