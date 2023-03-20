const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    recipename: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    minutes: {
        type: Number,
        required: true
    },
    seconds: {
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    ingredients: {
        type: Array,
        required: true
    },
    amounts: {
        type: Array,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recipe', RecipeSchema);