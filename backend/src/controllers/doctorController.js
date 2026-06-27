import User from "../models/User.js";

export const getAllDoctors = async (
  req,
  res
) => {
  try {

    const doctors =
      await User.find({
        role: "doctor",
      }).select(
        "-password"
      );

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};