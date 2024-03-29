import { Timestamp } from "mongodb";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true,
    },
    Thumbnail: {
        type: String,
        required: true,
    },
    Title: {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    ispublished: {
        type: Boolean,
        required: true,
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{
    timestamps: true,
});

VideoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", VideoSchema);