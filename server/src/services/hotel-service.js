import * as hotelDao from '../daos/hotel-dao.js';

// implement function to find all hotels
export const getAllHotels = async () => {
    return hotelDao.getAllHotels();
}

// fucntion to update a hotel's reviews (add one to array)
export const addReview = async (personId, hotelName, review) => {
    return hotelDao.addReview(personId, hotelName, review);
}


// function get all reviews for specific hotel
export const getAllReviews = async (hotelName) => {
    return hotelDao.getAllReviews(hotelName);
}