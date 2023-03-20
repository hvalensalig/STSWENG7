const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema ({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    name:{
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    location:{
        type: mongoose.SchemaTypes.String,
        required: false,
    }
})

module.exports = mongoose.model('users', usersSchema)