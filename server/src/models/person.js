import mongoose from 'mongoose';

const personSchema = new mongoose.Schema(
    {
        personId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        emailId: { type: String, required: true, unique: true },
        phoneNo: { type: Number, required: true },
        password: { type: String, required: true },
        bookings: Array
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

export const personModel = mongoose.model('person', personSchema);