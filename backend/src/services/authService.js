import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/env.js";

export const registerUserService = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    medicalLicenseNumber,
    specialization,
  } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      400,
      "User already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isApproved = role === "doctor" ? false : true;

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    medicalLicenseNumber: role === "doctor" ? medicalLicenseNumber : "",
    specialization: role === "doctor" ? specialization : "",
    isApproved,
  });

  if (role === "doctor") {
    await Doctor.create({
      userId: user._id,
      specialization: specialization || "General Ophthalmology",
      medicalLicenseNumber: medicalLicenseNumber || "PENDING",
      isApproved: false,
    });
  }

  return {
    success: true,
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