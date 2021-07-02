import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
    {
        hotelName: { type: String, required: true },
        description: String,
        amenities: String,
        phoneNo: { type: Number, required: true },
        address: { type: String, required: true },
        reviews: Array
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

export const hotelModel = mongoose.model('hotel', hotelSchema);
