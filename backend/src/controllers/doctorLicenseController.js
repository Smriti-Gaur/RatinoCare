import asyncHandler from "../utils/asyncHandler.js";
import {
  createDoctorLicenseService,
  disableDoctorLicenseService,
  getDoctorLicensesService,
} from "../services/doctorLicenseService.js";

export const createDoctorLicense = asyncHandler(async (req, res) => {
  const data = await createDoctorLicenseService(req.user.id, req.body);
  res.status(201).json(data);
});

export const getDoctorLicenses = asyncHandler(async (req, res) => {
  const data = await getDoctorLicensesService();
  res.status(200).json(data);
});

export const disableDoctorLicense = asyncHandler(async (req, res) => {
  const data = await disableDoctorLicenseService(req.params.id);
  res.status(200).json(data);
});
