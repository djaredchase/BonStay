import { personModel } from '../models/person.js'
import bcrypt from 'bcrypt';

// function to register (insert) a user
export const savePerson = async (person) => {
    const id = await personModel.countDocuments() + 1;
    person.personId = `P-${id}`;
    const newPerson = personModel.create(person);
    return newPerson;
}

// function to login a user
export const loginPerson = async (email, password) => {
    // make sure that user exists based on their emailId
    const query = { emailId: email };
    const person = await personModel.findOne(query);
    console.log('PERSON', person);
    if (!person) throw Error('incorrect username or password');

    // if person exists, check for correct password
    if(await bcrypt.compare(password, person.password)) {
        return true;
    }
    throw Error('incorrect username or password');
}


// function to logout a user
export const logoutPerson = async () => {
    const isLoggedIn = false;
    return isLoggedIn;
}

// get all users
export const getAllPeople = async () => {
    const people = await personModel.find();
    return people;
}
