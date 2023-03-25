const controller = require('../../controllers/controller');
const profileController = require('../../controllers/profileController');
const recipeModel = require('../../models/RecipeModel');
const db = require("../../models/db.js");
jest.mock('../../models/db.js');

describe('add recipe Validator', () => {

    it('incomplete info', async () => {
        const req = {
            body: {
                recipename: "food",
                owner: "Josh",
                minutes: "1",
                seconds: "20",
                image: "hello.jpg",
            },
            flash: jest.fn((x) => x),
        };

        const res = {
            redirect: jest.fn((x) => x),
        };

        db.insertOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        await profileController.postAddRecipe(req, res);

        expect(log).toHaveBeenCalledWith('Please fill up everything.');
        log.mockClear();
        log.mockRestore();
    });

    it('No image uploaded puts default image', async () => {
        const req = {
            body: {
                recipename: "food",
                owner: "Josh",
                minutes: "1",
                seconds: "20",
            },

            flash: jest.fn((x) => x),
        };

        const res = {
            redirect: jest.fn((x) => x),
        };

        db.insertOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        await profileController.postAddRecipe(req, res);

        expect(log).toHaveBeenCalledWith('default image uploaded.');
        log.mockClear();
        log.mockRestore();
    });

});