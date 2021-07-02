import express from 'express';
import bcrypt from 'bcrypt';
import * as personService from '../services/person-service.js';

export const userRouter = express.Router();

// endpoint for user registration
// use bcrypt to securely store password
userRouter.post('/register', async (req, res) => {
    try {
        if (req.body.password.length < 8 || req.body.password.length > 12) {
            throw Error('Enter a valid password with at least 8 and not more than 12 characters');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const person = {
            ...req.body,
            password: hashedPassword
        };
        const newPerson = await personService.savePerson(person);
        res.status(201).json({
            message: 'Successfully created new user',
            newPerson
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user login
userRouter.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const isLoggedIn = await personService.loginPerson(email, password);
        res.status(200).json({
            message: 'Login successful',
            isLoggedIn
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// endpoint for user logout
userRouter.get('/logout', async (req, res) => {
    try {
        const isLoggedIn = await personService.logoutPerson();
        res.status(200).json({
            message: 'Logout successful',
            isLoggedIn
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// get all users
userRouter.get('', async (req, res) => {
    try {
        const people = await personService.getAllPeople();
        res.status(200).json({
            message: 'Got all users',
            people
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// could add endpoint for deleting a user account
