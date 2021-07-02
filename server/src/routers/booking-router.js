import express from 'express';
import * as bookingService from '../services/booking-service.js';

export const bookingRouter = express.Router();

// endpoint for user to book a room
bookingRouter.post('/:personId/:hotelName', async (req, res) => {
    try {
        const bookingItem = req.body;
        const personId = req.params.personId;
        const resData = await bookingService.bookHotel(personId, bookingItem);
        res.status(201).json({
            message: 'Booking created successfully',
            ...resData
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user to change the date of already scheduled booking
bookingRouter.patch('/:personId', async (req, res) => {
    try {
        const bookingDetails = req.body;
        const personId = req.params.personId;
        const updatedBooking = await bookingService.updateBooking(personId, bookingDetails);
        res.status(201).json({
            message: 'Booking updated successfully',
            booking: updatedBooking
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user to get all of their bookings
bookingRouter.get('/:personId', async (req, res) => {
    try {
        const personId = req.params.personId;
        const bookings = await bookingService.getBookingsByPersonId(personId);
        if (bookings.length < 1) {
            res.status(200).json({
                status: 'success',
                message: 'No bookings made yet'
            });
        }
        res.status(200).json({
            status: 'success',
            results: bookings.length,
            bookings
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user to cancel a booking
bookingRouter.delete('/:personId/:bookingId', async (req, res) => {
    try {
        const personId = req.params.personId;
        const bookingId = req.params.bookingId;
        const deletion = await bookingService.deleteBooking(personId, bookingId);
        res.status(200).json({
            message: 'Booking successfully deleted',
            deletion
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});
