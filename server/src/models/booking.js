import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        bookingId: { type: String, required: true, unique: true },
        hotelName: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        noOfPerons: { type: Number, required: true },
        noOfRooms: { type: Number, required: true },
        typeOfRoom: String
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

export const bookingModel = mongoose.model('booking', bookingSchema);