import asyncHandler from "../utils/asyncHandler.js";
import Apierror from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.access || req.headers['x-access-token'] || req.headers['authorization']?.replace('Bearer ', '');
    console.log(token)
    if (!token) {
        throw new Apierror('Please login to access this route', 401)
    }

    const decodedjwt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedjwt._id).select('-password -refreshToken')

    if (!user) {
        throw new Apierror('Invalid Access Token', 401)
    }
    req.user = user
    next()
})