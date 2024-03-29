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
        required: true,
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
    jwt.sign(
        {
            id: this._id,
            email : this.email,
            username : this.username,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: ACCESS_TOKEN_EXPIRE
        }
    )
}
userSchema.methods.generateRefreshToken= async function() {
    jwt.sign(
        {
            id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: REFRESH_TOKEN_EXPIRE
        }
    )
}


export const User = mongoose.model("User", userSchema);
