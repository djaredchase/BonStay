import { bookingModel } from "../models/booking.js";
import { hotelModel } from "../models/hotel.js";
import { personModel } from "../models/person.js";
import { returnUpdated } from "./db.js";
// import mongoose from 'mongoose';

// implement function for user to book a hotel
export const bookHotel = async (personId, bookingItem) => {
    // This function should use a transaction for the multiple document updates
    // But since that requires converting a standalone mongod instance to a replica set, I'll save it for next project

    // validate personId
    const person = await personModel.findOne({ personId });
    if (!person) throw Error('Not a valid Person Id');

    // validate hotelName of bookingItem, that it exists
    const hotel = await hotelModel.findOne({ hotelName: bookingItem.hotelName });
    if (!hotel) throw Error('Not a valid Hotel Name');

    // ensure that the booking dates do not fall between any of the person's existing bookings
    const datesAreValid = await checkAgainstExistingBookingDates(personId, bookingItem);
    console.log(datesAreValid);
    if (!datesAreValid) throw Error('You have a booking on the same date');

    // two steps: add a bookingId and create booking...
    const id = await bookingModel.countDocuments() + 1;
    bookingItem.bookingId = `B-${id}`;
    await bookingModel.create(bookingItem);

    // update user document
    const query = { personId: personId };
    const update = { $push: { bookings: bookingItem } };
    const newUserBooking = await personModel.findOneAndUpdate(query, update, returnUpdated);
    const bookings = newUserBooking.bookings;

    // want to return personId and the booking that was added
    return {
        user: newUserBooking.personId,
        booking: bookings[bookings.length - 1]
    }
}

const checkAgainstExistingBookingDates = async (personId, bookingItem) => {
    const { startDate, endDate } = bookingItem;
    const projection = { bookings: 1 };
    const existingBookings = await personModel.findOne({ personId }, projection);
    const { bookings } = existingBookings;
    for (const b of bookings) {
        if (startDate >= b.startDate && startDate <= b.endDate) return false;
        if (endDate >= b.startDate && endDate <= b.endDate) return false;
    }
    return true;
}

const validateUserAndBookingId = async (personId, bookingId) => {
    const person = await personModel.findOne({ personId });
    if (!person) return false;
    const booking = person.bookings.find((b) => b.bookingId == bookingId);
    if (!booking) return false;

    return true;
}

// THIS COULD PROBABLY BE REFACTORED TO NOT HIT DB 3 TIMES
// implement function to update a booking (the start/end dates)
export const updateBooking = async (personId, bookingDetails) => {
    const isValid = await validateUserAndBookingId(personId, bookingDetails.bookingId);
    if (!isValid) throw Error('Not a valid Booking Id or Person Id');

    // req.body will have startDate, endDate, and bookingId
    // two steps: update booking in booking collection
    const query = { bookingId: bookingDetails.bookingId };
    const update = { startDate: bookingDetails.startDate, endDate: bookingDetails.endDate };
    const updatedBooking = await bookingModel.findOneAndUpdate(query, update, returnUpdated);

    // update the same booking in user array. use findAndReplace?
    // first pull the old booking object
    const query2 = { personId: personId };
    const update2 = { $pull: { bookings: { bookingId: bookingDetails.bookingId } } };
    await personModel.findOneAndUpdate(query2, update2, returnUpdated);
    // then push on the new one
    const update3 = { $push: { bookings: updatedBooking } };
    const updatedUser = await personModel.findOneAndUpdate(query2, update3, returnUpdated);
    const bookings = updatedUser.bookings;

    return bookings[bookings.length - 1];
}

// implement function to find all bookings made by a user
export const getBookingsByPersonId = async (personId) => {
    // return bookings array for specific personId
    const query = { personId: personId };
    const projection = { _id: 0, bookings: 1 };
    const person = await personModel.findOne(query, projection);

    return person.bookings;
}

// fucntion to delete a booking
export const deleteBooking = async (personId, bookingId) => {
    const isValid = await validateUserAndBookingId(personId, bookingId);
    if (!isValid) throw Error('Not a valid Booking Id or Person Id. Could not delete the booking');
    // two steps: delete booking from user booking array, delete from booking collection
    // delete from booking collection
    const query = { bookingId: bookingId };
    const deletedBooking = await bookingModel.deleteOne(query);
    // delete booking from user array (update operation)
    const query2 = { personId: personId };
    const update = { $pull: { bookings: { bookingId: bookingId } } };
    await personModel.findOneAndUpdate(query2, update, returnUpdated);

    return deletedBooking;
}
