import asyncHandler from "../utils/asyncHandler.js";

import { getAllDoctorsService } from "../services/doctorService.js";

export const getAllDoctors = asyncHandler(
  async (req, res) => {

    const data =
      await getAllDoctorsService();

    res.status(200).json(data);

  }
);