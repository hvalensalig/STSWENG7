const profileController = require('../controllers/profileController');
const recipeModel = require('../models/RecipeModel');
const db = require("../models/db.js");

jest.mock('../models/db.js');

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

describe('edit profile validator', () => {
    it('complete edit info', () => {
        const req = {
            session: { username: "fredrick" },
            body: {
                username: "jeff",
                firstname: "jeffery",
                lastname: "jefferson",
                location: "Phillippines"
            },

            flash: jest.fn()
        }

        const res = {
            redirect: jest.fn(),
        };

        db.updateOne.mockImplementationOnce((model, filter, update, flag) => flag(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.postEditProfile(req, res);

        expect(log).toHaveBeenCalledWith("Profile has been updated.");
        expect(req.flash.mock.calls).toEqual([["success_msg1", "Profile has been updated."]]);
        expect(res.redirect.mock.calls).toEqual([['/home']]);
        log.mockClear();
        log.mockRestore();
    });

    it('no edit info made', () => {
        const req = {
            session: { username: "fredrick" },
            body: {
                username: "",
                firstname: "",
                lastname: "",
                location: ""
            },

            flash: jest.fn()
        }

        const res = {
            redirect: jest.fn(),
        };

        db.updateOne.mockImplementationOnce((model, filter, update, flag) => flag(false));

        const log = jest.spyOn(global.console, 'log');

        profileController.postEditProfile(req, res);

        expect(log).toHaveBeenCalledWith("Profile has been updated.");
        expect(req.flash.mock.calls).toEqual([["error_msg1", "No changes were made."]]);
        expect(res.redirect.mock.calls).toEqual([['/home']]);
        log.mockClear();
        log.mockRestore();
    });

    it('failed try catch edit, go to error', () => {
        const req = {
            //session: { username: "" },
            body: {
                username: "jeff",
                firstname: "jeffery",
                lastname: "jefferson",
                location: "Phillippines"
            },

            flash: jest.fn()
        }

        const res = {
            redirect: jest.fn(),
        };

        db.updateOne.mockImplementationOnce((model, filter, update, flag) => flag(false));

        const log = jest.spyOn(global.console, 'log');

        profileController.postEditProfile(req, res);

        //expect(log).toHaveBeenCalledWith("An error has occur profile update failed.");
        expect(log.mock.calls[0][0]).toBe("An error has occur profile update failed.");
        expect(req.flash.mock.calls).toEqual([["error_msg1", "TypeError: Cannot read properties of undefined (reading 'username')"]]);
        expect(res.redirect.mock.calls).toEqual([['/home']]);
        log.mockClear();
        log.mockRestore();
    });
});

describe('get edit recipe page', () => {
    it('show all profle info', () => {
        const req = {
            session: { username: "TrailTester" } 
        }

        const res = {
            render: jest.fn()
        }

        db.findOne.mockImplementationOnce((model, query, projection, result) => result({
            username: "a", 
            firstname: "b", 
            lastname: "c", 
            location: "d",
        }));

        profileController.getEditProfile(req, res);

        expect(res.render.mock.calls).toEqual([["editProfile", {"firstname": "b", "lastname": "c", "location": "d", "username": "a"}]]);
    })
});

describe('add recipe Validator', () => {

    it('incomplete info (image and ingredients)', () => {
        const req = {
            session: { username: "TrailTester" },
            body: {
                recipe_name: "food",
                owner_name: "Josh",
                recipe_minutes: "1",
                recipe_seconds: "20",
                image: "",
                //ingredients: "",
                //amounts: null,
                recipe_directions: "",
            },

            files: {
                /*
                recipe_image: {
                    name: "",
                    mv: jest.fn().mockReturnValue(true)
                }
                */
            },
            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
        };

        db.insertOne.mockImplementationOnce((Recipe, recipe, flag) => flag(false));

        const log = jest.spyOn(global.console, 'log');

        profileController.postAddRecipe(req, res);

        //expect(log.mock.calls).toBe();
        expect(log.mock.calls[0][0]).toBe("Please input the recipe image");
        expect(log.mock.calls[1][0]).toBe("Please input the directions.");
        expect(log.mock.calls[2][0]).toBe("Please fill up everythingsss.")
        expect(req.flash.mock.calls).toEqual([["error_msg", "Please input the recipe image.\rPlease input the directions."]]);
        expect(res.redirect.mock.calls).toEqual([['/home#addRecipe-container']]);
        log.mockClear();
        log.mockRestore();
    });

    it('complete info', () => {
        const req = {
            session: { username: "TrailTester" },
            body: {
                recipe_name: "food",
                owner_name: "Josh",
                recipe_minutes: "1",
                recipe_seconds: "20",
                image: "",
                ingredients: "chicken",
                amounts: 20,
                recipe_directions: "supermario",
            },

            files: {
                recipe_image: {
                    name: "laserbeam",
                    mv: jest.fn().mockReturnValue(true)
                }
            },
            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
        };

        db.insertOne.mockImplementationOnce((Recipe, recipe, flag) => flag(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.postAddRecipe(req, res);

        expect(log).toHaveBeenCalledWith("Recipe has been added.");
        expect(req.flash.mock.calls).toEqual([["success_msg", "Recipe has been added."]]);
        expect(res.redirect.mock.calls).toEqual([['/home#addRecipe-container']]);
        log.mockClear();
        log.mockRestore();
    });

    it('failed try catch add, go to error', () => {
        const req = {
            session: { username: "TrailTester" },
            body: {
                recipe_name: "food",
                owner_name: "Josh",
                recipe_minutes: "1",
                recipe_seconds: "20",
                image: "",
                ingredients: "chicken",
                amounts: 20,
                recipe_directions: "supermario",
            },

            files: {
                recipe_image: {
                    /*
                    name: "laserbeam",
                    mv: jest.fn().mockReturnValue(true)
                    */
                }
            },
            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
        };

        db.insertOne.mockImplementationOnce((Recipe, recipe, flag) => flag(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.postAddRecipe(req, res);

        expect(log).toHaveBeenCalledWith("Please fill up everything.", "TypeError: imageUploadFile.mv is not a function");
        expect(req.flash.mock.calls).toEqual([["error_msg", "TypeError: imageUploadFile.mv is not a function"]]);
        expect(res.redirect.mock.calls).toEqual([['/home#addRecipe-container']]);
        log.mockClear();
        log.mockRestore();
    });
});