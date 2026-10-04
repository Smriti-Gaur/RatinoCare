import asyncHandler from "../utils/asyncHandler.js";

import {
  approveDoctorService,
  getAllDoctorsService,
  getPendingDoctorsService,
  rejectDoctorService,
} from "../services/doctorService.js";

export const getAllDoctors = asyncHandler(
  async (req, res) => {

    const data =
      await getAllDoctorsService();

    res.status(200).json(data);

  }
);

export const getPendingDoctors = asyncHandler(async (req, res) => {
  res.status(200).json(await getPendingDoctorsService());
});

export const approveDoctor = asyncHandler(async (req, res) => {
  res.status(200).json(await approveDoctorService(req.user.id, req.params.doctorId));
});

export const rejectDoctor = asyncHandler(async (req, res) => {
  res.status(200).json(
    await rejectDoctorService(req.user.id, req.params.doctorId, req.body.reason.trim())
  );
});