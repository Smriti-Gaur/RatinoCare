import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import DoctorLicense from "../models/DoctorLicense.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/env.js";
import {
  normalizeLicenseNumber,
  validateLicenseNumber,
  validateSpecialization,
} from "../validators/doctorLicenseValidator.js";

export const registerUserService = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    medicalLicenseNumber,
    specialization,
  } = userData;

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(
      400,
      "User already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isApproved = role === "doctor" ? false : true;
  let claimedLicense = null;
  let user = null;

  try {
    if (role === "doctor") {
      validateLicenseNumber(medicalLicenseNumber);
      validateSpecialization(specialization);

      const normalizedLicenseNumber = normalizeLicenseNumber(medicalLicenseNumber);
      const license = await DoctorLicense.findOne({ normalizedLicenseNumber });

      if (!license) {
        throw new ApiError(400, "Medical license does not exist in RatinoCare");
      }

      if (license.status === "claimed") {
        throw new ApiError(400, "Medical license has already been claimed");
      }

      if (license.status === "disabled") {
        throw new ApiError(400, "Medical license is disabled");
      }

      if (license.specialization.trim().toLowerCase() !== specialization.trim().toLowerCase()) {
        throw new ApiError(400, "Specialization does not match the verified license");
      }

      const userId = new mongoose.Types.ObjectId();
      claimedLicense = await DoctorLicense.findOneAndUpdate(
        { _id: license._id, status: "available" },
        {
          $set: {
            status: "claimed",
            claimedBy: userId,
            claimedAt: new Date(),
          },
        },
        { new: true },
      );

      if (!claimedLicense) {
        throw new ApiError(400, "Medical license has already been claimed");
      }

      user = await User.create({
        _id: userId,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        medicalLicenseNumber: claimedLicense.licenseNumber,
        specialization: specialization.trim(),
        isApproved,
        approvalStatus: "pending",
      });

      await Doctor.create({
        userId: user._id,
        specialization: specialization.trim(),
        medicalLicenseNumber: claimedLicense.licenseNumber,
        isApproved: false,
      });
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        medicalLicenseNumber: "",
        specialization: "",
        isApproved,
        approvalStatus: "approved",
      });
    }
  } catch (error) {
    if (user?._id) {
      await Doctor.deleteOne({ userId: user._id });
      await User.deleteOne({ _id: user._id });
    }

    if (claimedLicense) {
      await DoctorLicense.updateOne(
        { _id: claimedLicense._id, claimedBy: user?._id || claimedLicense.claimedBy },
        {
          $set: { status: "available", claimedBy: null, claimedAt: null },
        },
      );
    }

    if (error.code === 11000) {
      throw new ApiError(400, "User already exists");
    }

    throw error;
  }

  return {
    success: true,
    user: {
      publicId: user.publicId,
      role: user.role,
    },
    message:
      role === "doctor"
        ? "Doctor account submitted successfully! Pending administrative credential verification."
        : "User registered successfully",
  };
};

export const loginUserService = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
400,
"Invalid Credentials"
);
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new ApiError(
404,
"User not found"
);
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    success: true,
    message: "Login Successful",
    token,
  };
};

export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    user,
  };
};