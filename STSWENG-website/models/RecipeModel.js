import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: false
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

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;