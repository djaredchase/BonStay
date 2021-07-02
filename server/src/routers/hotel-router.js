import express from 'express';
import * as hotelService from '../services/hotel-service.js';

export const hotelRouter = express.Router();

// endpoint to get list of all avaiable hotels (available in the city)
hotelRouter.get('', async (req, res) => {
    try {
        const hotels = await hotelService.getAllHotels();
        res.status(200).json({
            hotels
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user to add a review for the hotel they stayed at
hotelRouter.patch('/reviews', async (req, res) => {
    try {
        const personId = req.body.personId;
        const hotelName = req.body.hotelName;
        const review = req.body.review;
        const data = await hotelService.addReview(personId, hotelName, review);
        res.status(200).json({
            message: 'Successfully added review',
            data
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user to see all the reviews for a hotel
hotelRouter.get('/reviews/:hotelName', async (req, res) => {
    try {
        const hotelName = req.params.hotelName;
        const reviews = await hotelService.getAllReviews(hotelName);
        if (reviews.length < 1) {
            res.status(200).json({
                status: 'Success',
                message: `No reviews added yet for ${hotelName}`
            });
        }
        res.status(200).json({
            message: 'Success',
            reviews
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

