import asyncHandler  from '../utils/asyncHandler.js';
import Apierror from '../utils/ApiErrors.js';
import User from '../models/user.model.js';
import {uploadToCloudinary} from '../utils/cloudinary.js';
import APiResponse from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req, res) => {
    
    const {fullname,email,username,password} = req.body
    if (!fullname || !email || !username || !password) {
        throw new Apierror('Please fill all fields', 400)
    }
    const existed = await User.findOne({username})

    if (existed) {
        throw new Apierror('Username already exists', 409)
    }

    const coverimagepasth = req.files?.cover[0].path
    const avatarpath = req.files?.avatar[0].path

    console.log(coverimagepasth, avatarpath)

    if (!avatarpath) {
        throw new Apierror('Please upload avatar image', 400)
    }
    const avatar_cloud = await uploadToCloudinary(avatarpath)
    const cover_cloud = await uploadToCloudinary(coverimagepasth)


    if (!avatar_cloud) {
        throw new Apierror('Error uploading image', 500)
    }

    const user = await User.create({
        fullname : fullname,
        email : email,
        username : username,
        password : password,
        avatar: avatar_cloud.url,
        coverimage: cover_cloud?.url || "" ,
    })

   const createdUser = await User.findById(user.id).select('-password -refreshToken')

   if (!createdUser) {
       throw new Apierror('User not found', 404)
   }

   return res.status(201).json(
       new APiResponse(200, createdUser, 'User created successfully')
   )
}
);


export default registerUser;
