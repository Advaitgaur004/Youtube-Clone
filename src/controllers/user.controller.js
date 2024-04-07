import asyncHandler  from '../utils/asyncHandler.js';
import Apierror from '../utils/ApiErrors.js';
import User from '../models/user.model.js';
import {uploadToCloudinary, deleteToCloudinary} from '../utils/cloudinary.js';
import APiResponse from '../utils/ApiResponse.js';
import generateAccessAndRefreshToken from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
    
    const {fullname,email,username,password} = req.body
    if (!fullname || !email || !username || !password) {
        throw new Apierror('Please fill all fields', 400)
    }
    const existed = await User.findOne({username})

    if (existed) {
        throw new Apierror('Username already exists', 409)
    }

    const coverimagepath = req.files?.cover?.[0]?.path;
    const avatarpath = req.files?.avatar?.[0]?.path;

    console.log(coverimagepath, avatarpath)

    if (!avatarpath) {
        throw new Apierror('Please upload avatar image', 400)
    }

    const avatar_cloud = await uploadToCloudinary(avatarpath)
    const cover_cloud = await uploadToCloudinary(coverimagepath)
    
    if (!avatar_cloud) {
        throw new Apierror('Error uploading image', 500)
    }

    const user = await User.create({
        fullname : fullname,
        email : email,
        username : username,
        password : password,
        avatar: avatar_cloud.url,
        coverimage: cover_cloud?.url || "",
        refeshToken: ""

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

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new Apierror('Please fill all fields', 400);
    }

    const user = await User.findOne({ username });

    if (!user) {
        throw new Apierror('Register Yourself', 401);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user, User);

    const loggedInUser = await User.findById(user.id).select('-password -refreshToken');
    const option = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie('refreshToken', refreshToken, option)
        .cookie('accessToken', accessToken, option)
        .json(new APiResponse(200, { accessToken, refreshToken, user: loggedInUser }, 'User logged in successfully'));
});


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.headers['x-refresh-token'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        throw new Apierror('Please login to access this route', 401)
    }
    const decodetoken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodetoken.id)
    if (!user) {
        throw new Apierror('User not found', 404)
    }
    if (user.refreshToken !== token) {
        throw new Apierror('Invalid token', 401)
    }
    const options = {
        httpOnly: true,
        secure: true,
    }

    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user,User)
    return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json(
        new APiResponse(200, {accessToken, refreshToken}, 'Token refreshed successfully')
    )

})

const changepassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new Apierror('User not found', 404)
    }
    const {oldpassword, newpassword} = req.body //From the client
    const ispasswordcorrect = await user.isPasswordCorrect(oldpassword)
    if (!ispasswordcorrect) {
        throw new Apierror('Invalid credentials', 401)
    }
    user.password = newpassword
    user.save({validateBeforeSave: false})
    return res.status(200).json(
        new APiResponse(200, {}, 'Password changed successfully')
    )
})

const updateAccount = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                fullname: req.body.fullname,
                email : req.body.email,
                username : req.body.username,
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select('-password -refreshToken')

    return res.status(200).json(
        new APiResponse(200, user, 'User updated successfully')
    )
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarfile = req.file?.path
    const user_ = await User.findById(req.user._id)
    await deleteToCloudinary(user_.avatar)
    user_.avatar = ""
    user_.save({validateBeforeSave: false})

    if (!avatarfile) {
        throw new Apierror('Please upload an image', 400)
    }
    const avatar_new = await uploadToCloudinary(avatarfile)
    if (!avatar_new.url) {
        throw new Apierror('Error uploading image', 401)
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar_new.url
        }
    },
    {
        new: true,
    }
    ).select('-password -refreshToken')

    return res.status(200).json(
        new APiResponse(200, user, 'Avatar updated successfully')
    )})
const updatecover= asyncHandler(async (req, res) => {
    const coverfile = req.file?.path

    const user_ = await User.findById(req.user._id)
    if (user_.coverimage){
        await deleteToCloudinary(user_.coverimage)
        user_.coverimage = ""
        user_.save({validateBeforeSave: false})
    }


    if (!coverfile) {
        throw new Apierror('Please upload an image', 400)
    }
    const cover_new = await uploadToCloudinary(coverfile)
    if (!cover_new.secure_url) {
        throw new Apierror('Error uploading image', 401)
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverimage: cover_new.secure_url
        }
    },
    {
        new: true,
        runValidators: true
    }
    ).select('-password -refreshToken')

    return res.status(200).json(
        new APiResponse(200, user, 'Cover image updated successfully')
    )
})

export  {registerUser,loginUser,logoutUser,refreshAccessToken,changepassword, updateAccount, updateAvatar,updatecover};
