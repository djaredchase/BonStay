import { hotelModel } from '../models/hotel.js';
import { personModel } from '../models/person.js';
import { returnUpdated } from './db.js';

// implement function to find all hotels
export const getAllHotels = async () => {
    const hotels = await hotelModel.find();
    return hotels;
}

// function to validate request to add a review
const personHasBookedHotelBefore = async (personId, hotelName) => {
    const person = await personModel.findOne({ personId });
    if (!person) return 'Invalid Person Id';
    const hotel = await hotelModel.findOne({ hotelName });
    if (!hotel) return 'Invalid hotelName';
    const bookings = person.bookings.filter((b) => b.hotelName == hotelName);
    for (const b of bookings) {
        if (b.endDate <= new Date()) return true;
    }
    return false;
}

// function to update a hotel's reviews (add one to array)
export const addReview = async (personId, hotelName, review) => {
    const isValid = await personHasBookedHotelBefore(personId, hotelName);
    if (typeof isValid == 'string') throw Error(isValid);
    if (!isValid) throw Error('Cannot add a review until you stay at this hotel');

    const query = { hotelName: hotelName };
    const update = { $push: { reviews: review } };
    const updatedHotel = await hotelModel.findOneAndUpdate(query, update, returnUpdated);
    return {
        hotel: updatedHotel.hotelName,
        review: updatedHotel.reviews[updatedHotel.reviews.length - 1]
    }
}


// function to get all reviews for specific hotel
export const getAllReviews = async (hotelName) => {
    const query = { hotelName: hotelName };
    const projection = { _id: 0, reviews: 1 }
    const hotel = await hotelModel.findOne(query, projection);
    if (!hotel) throw Error(`${hotelName} is not a valid hotelName`);
    return hotel.reviews;
}
