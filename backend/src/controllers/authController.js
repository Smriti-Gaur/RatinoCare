import {
  registerUserService,
  loginUserService,
  getProfileService,
} from "../services/authService.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from  "../utils/asyncHandler.js";

export const registerUser =
asyncHandler(async(req,res)=>{

    await registerUserService(req.body);

    return res.status(201).json(

        new ApiResponse(
            201,
            null,
            "User Registered Successfully"
        )

    );

});
export const loginUser = asyncHandler(
  async (req, res) => {

    const data = await loginUserService(req.body);

    res.status(200).json(data);

  }
);

export const getProfile =
asyncHandler(async(req,res)=>{

    const data =
    await getProfileService(req.user.id);

    return res.status(200).json(

        new ApiResponse(
            200,
            data.user,
            "Profile fetched successfully"
        )

    );

});