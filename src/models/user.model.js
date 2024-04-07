import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        lower:true,
        trim: true,
        index:true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
        default: "https://www.gravatar.com/avatar/"
    },
    coverimage : {
        type: String,
        required: false,
        default: "https://www.gravatar.com/avatar/"
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    refreshToken: {
        type: String
    }
    },
    {
        timestamps: true,
    });


userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken= async function() {
    return jwt.sign(
        {
            id: this._id,
            email : this.email,
            username : this.username,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
    
}
userSchema.methods.generateRefreshToken= async function() {
    return jwt.sign(
        {
            id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}


export const User = mongoose.model("User", userSchema);

export default User;
