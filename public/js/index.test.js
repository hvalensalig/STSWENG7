const controller = require('../../controllers/controller');
const profileController = require('../../controllers/profileController');
const recipeModel = require('../../models/RecipeModel');
const db = require("../../models/db.js");
jest.mock('../../models/db.js');

// import {useSession} from "next-auth/react";

// jest.mock("next-auth/react", () => {
//   const originalModule = jest.requireActual('next-auth/react');
//   const mockSession = {
//     expires: new Date(Date.now() + 2 * 86400).toISOString(),
//     user: { username: "TrailTester" }
//   };
//   return {
//     __esModule: true,
//     ...originalModule,
//     useSession: jest.fn(() => {
//       return {data: mockSession, status: 'authenticated'}  // return type is [] in v3 but changed to {} in v4
//     }),
//   };
// });


  
describe('add recipe Validator', () => {

    it('incomplete info', async () => {
        const req = {
            session: { username: "TrailTester" },
            body: {
                recipename: "food",
                owner: "Josh",
                minutes: "1",
                seconds: "20",
                image: "hello.jpg",
            },
            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
        };

        db.insertOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        await profileController.postAddRecipe(req, res);

        expect(log).toHaveBeenCalledWith('Please fill up everything.');
        log.mockClear();
        log.mockRestore();
    });

    it('No image uploaded error', async () => {
        const req = {
            body: {
                recipename: "food",
                owner: "Josh",
                minutes: "1",
                seconds: "20",
                username: "Trailtester",
            },

            flash: jest.fn((x) => x),
        };

        const res = {
            redirect: jest.fn((x) => x),
        };

        db.insertOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        await profileController.postAddRecipe(req, res);

        expect(log).toHaveBeenCalledWith('Please input the recipe image.');
        log.mockClear();
        log.mockRestore();
    });

});