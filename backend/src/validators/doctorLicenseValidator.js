import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const normalizeLicenseNumber = (value) => value.trim().toUpperCase();

export const validateLicenseNumber = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, "Medical license number is required");
  }

  if (!/^[A-Z0-9][A-Z0-9 -]{3,29}$/i.test(value.trim())) {
    throw new ApiError(
      400,
      "Medical license number must be 4 to 30 characters using letters, numbers, spaces, or hyphens",
    );
  }
};

export const validateSpecialization = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, "Specialization is required");
  }

  if (value.trim().length > 100) {
    throw new ApiError(400, "Specialization must be 100 characters or fewer");
  }
};

export const validateCreateLicense = (req, res, next) => {
  try {
    validateLicenseNumber(req.body.licenseNumber);
    validateSpecialization(req.body.specialization);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLicenseId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, "Invalid license ID"));
  }

  next();
};
