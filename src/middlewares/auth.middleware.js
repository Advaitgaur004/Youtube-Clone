import asyncHandler from "../utils/asyncHandler.js";
import Apierror from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") 
        console.log("token is ",token);
        if (!token) {
            throw new Apierror(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken")
        console.log("user is ",user);
        if (!user) {
            
            throw new Apierror(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()

    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid access token")
    }
    
})
  