import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file_path) => {
    try {
        if (!file_path) {
            return;
        }
        const result = await cloudinary.uploader.upload(file_path,{resource_type :"auto"});
        console.log("file uploaded to cloudinary", result.url);
        fs.unlinkSync(file_path);
        return result;

    } catch (error) {
        console.error("Error uploading file to cloudinary", error);
        fs.unlinkSync(file_path);
        return null
    }
}

const deleteToCloudinary = async (cloudinary_file_path) => {
    try {
        if (!cloudinary_file_path) {
            return;
        }
        const result = await cloudinary.uploader.destroy(cloudinary_file_path);
        console.log("file deleted from cloudinary", result);
        return result;
        
    } catch (error) {
        console.error("Error deleting file to cloudinary", error);
    }
}
export {uploadToCloudinary, deleteToCloudinary};