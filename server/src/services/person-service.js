import * as personDao from '../daos/person-dao.js';

// function to register (insert) a user
export const savePerson = async (person) => {
    // validate user inputs
    if (person.name.length < 2) throw Error('Enter a valid name with at least two characters');

    const validatePhoneNo = /^[\d]{10}$/;
    if (!validatePhoneNo.test(person.phoneNo)) throw Error('Enter a valid phone no. with 10 digits');

    const validateEmail = /^[\w.]+@[A-Za-z0-9]+([.][A-Za-z]+)+$/;
    if(!validateEmail.test(person.emailId)) throw Error('Enter a valid email');

    // they have an error thrown for if the email used matches an existing one
    // but that should be handled by dataBase I think. Make sure appropriate error msg is thrown

    return personDao.savePerson(person);
}

// function to login a user
export const loginPerson = async (email, password) => {
    return personDao.loginPerson(email, password);
}


// function to logout a user
export const logoutPerson = async () => {
    return personDao.logoutPerson();
}

// get all users
export const getAllPeople = async () => {
    return personDao.getAllPeople();
}
