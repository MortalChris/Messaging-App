const mongoose = require('mongoose');
//express
const express = require('express')

const UsersModel = mongoose.model('Users', new mongoose.Schema({
    // Define your data schema here
    email: { type: String, required: true},
    password: { type: String, required: true }
    // Add more fields as needed
}));


module.exports = UsersModel;