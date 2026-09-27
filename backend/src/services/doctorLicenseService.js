import DoctorLicense from "../models/DoctorLicense.js";
import ApiError from "../utils/ApiError.js";
import {
  normalizeLicenseNumber,
  validateLicenseNumber,
  validateSpecialization,
} from "../validators/doctorLicenseValidator.js";

export const createDoctorLicenseService = async (adminId, data) => {
  validateLicenseNumber(data.licenseNumber);
  validateSpecialization(data.specialization);

  const licenseNumber = data.licenseNumber.trim();
  const normalizedLicenseNumber = normalizeLicenseNumber(licenseNumber);
  const specialization = data.specialization.trim();

  try {
    const license = await DoctorLicense.create({
      licenseNumber,
      normalizedLicenseNumber,
      specialization,
      createdBy: adminId,
    });

    return { success: true, license };
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "A license with this number already exists");
    }

    throw error;
  }
};

export const getDoctorLicensesService = async () => {
  const licenses = await DoctorLicense.find()
    .populate("createdBy", "name email")
    .populate("claimedBy", "name email")
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: licenses.length,
    licenses,
  };
};

export const disableDoctorLicenseService = async (licenseId) => {
  const license = await DoctorLicense.findById(licenseId);

  if (!license) {
    throw new ApiError(404, "Doctor license not found");
  }

  if (license.status === "claimed") {
    throw new ApiError(400, "A claimed license cannot be disabled");
  }

  if (license.status === "disabled") {
    throw new ApiError(400, "License is already disabled");
  }

  license.status = "disabled";
  await license.save();

  return { success: true, license };
};
