import * as bookingDao from '../daos/booking-dao.js';

// implement function for user to book a hotel
export const bookHotel = async (personId, bookingItem) => {
    bookingItem.startDate = new Date(bookingItem.startDate);
    bookingItem.endDate = new Date(bookingItem.endDate);

    // validate that hotelName exists
    // do other validations
    if (bookingItem.startDate < new Date())
        throw Error('Start Date should be a date greater than or equal to today');
    if (bookingItem.endDate < bookingItem.startDate)
        throw Error('End Date should be a date greater than or equal to start date');
    if (bookingItem.noOfPersons < 1 || bookingItem.noOfPersons > 5)
        throw Error('Number of Persons should be a valid number greater than 0 and less than or equal to 5');
    if (bookingItem.noOfRooms < 1 || bookingItem.noOfRooms > 3)
        throw Error('Number of rooms should be a valid number greater than 0 and less than or equal to 3');

    return bookingDao.bookHotel(personId, bookingItem);
}

// implement function to update a booking (the start/end dates)
export const updateBooking = async (personId, bookingDetails) => {
    // implement validations
    // don't let booking update go through if the booking id doesn't belong to this user
    // otherwise it will create a new booking with that id for that user
    // need to work out a better solution for the id field... if there are two bookings and the 1st one gets deleted then the remaining id has a 2 appended to it. Then if another is added and the length is one, then the newly added booking also has a two appended to it
    if (bookingDetails.startDate <= new Date())
        throw Error('Start Date should be a date greater than or equal to today');
    if (bookingDetails.endDate < bookingDetails.startDate)
        throw Error('End Date should be a date greater than or equal to start date');

    return bookingDao.updateBooking(personId, bookingDetails);
}

// implement function to find all bookings made by a user
export const getBookingsByPersonId = async (personId) => {
    return bookingDao.getBookingsByPersonId(personId);
}

// fucntion to delete a booking
export const deleteBooking = async (personId, bookingId) => {
    return bookingDao.deleteBooking(personId, bookingId);
}
