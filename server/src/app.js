import express from 'express';
import { userRouter } from './routers/person-router.js';
import { hotelRouter } from './routers/hotel-router.js';
import { bookingRouter } from './routers/booking-router.js';

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/person', userRouter);
app.use('/hotel', hotelRouter);
app.use('/booking', bookingRouter);
app.all('*', async (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid path'
    });
})

app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));
