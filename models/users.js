const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema ({
    firstname: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    lastname: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    location: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
})

module.exports = mongoose.model('users', usersSchema)