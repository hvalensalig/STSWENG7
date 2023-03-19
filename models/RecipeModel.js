const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: false
    },
    image: {
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
    ingredientname:{
        type: String,
        required: true
    },
    ingredientamount:{
        type: Number,
        required: true
    }
});

RecipeSchema.index({name: 'text'})
module.exports = mongoose.model('Recipe', RecipeSchema);