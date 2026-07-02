import asyncHandler from "../utils/asyncHandler.js";
import {
  getAdminDashboardService,
  getDoctorDashboardService,
  getPatientDashboardService,
} from "../services/dashboardService.js";

export const getAdminDashboard = asyncHandler(
  async (req, res) => {

    const data =
      await getAdminDashboardService();

    res.status(200).json(data);

  }
);

export const getDoctorDashboard = asyncHandler(
  async (req, res) => {

    const data =
      await getDoctorDashboardService(
        req.user.id
      );

    res.status(200).json(data);

  }
);

export const getPatientDashboard = asyncHandler(
  async (req, res) => {

    const data =
      await getPatientDashboardService(
        req.user.id
      );

    res.status(200).json(data);

  }
);