const profileController = require('../controllers/profileController');
const recipeModel = require('../models/RecipeModel');
const db = require("../models/db.js");
const fs = require('fs');

jest.mock('../models/db.js');
jest.mock('fs');

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

describe('get edit profile page', () => {
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

        expect(log).toHaveBeenCalledWith("An error has occur profile update failed.");
        expect(req.flash.mock.calls).toEqual([["error_msg1", "Cannot read properties of undefined (reading 'username')"]]);
        expect(res.redirect.mock.calls).toEqual([['/home']]);
        log.mockClear();
        log.mockRestore();
    });
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
                ingredients: "",
                amounts: null,
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

        //db.insertOne.mockImplementationOnce((Recipe, recipe, flag) => flag(false));

        const log = jest.spyOn(global.console, 'log');

        profileController.postAddRecipe(req, res);

        //expect(log.mock.calls).toBe();
        expect(log.mock.calls[0][0]).toBe("Please input the recipe image");
        expect(log.mock.calls[1][0]).toBe("Please input the ingredients.");
        expect(log.mock.calls[2][0]).toBe("Please input the directions.");
        expect(req.flash.mock.calls).toEqual([["error_msg", "Please input the recipe image.\rPlease input the ingredients.\rPlease input the directions."]]);
        expect(res.redirect.mock.calls).toEqual([['/home#addRecipe-container']]);
        log.mockClear();
        log.mockRestore();
    });

    it('incomplete info (ingredients)', () => {
        const req = {
            session: { username: "TrailTester" },
            body: {
                recipe_name: "food",
                owner_name: "Josh",
                recipe_minutes: "1",
                recipe_seconds: "20",
                image: "",
                ingredients: "",
                amounts: null,
                recipe_directions: "",
            },

            files: {
                recipe_image: {
                    name: "jeff",
                    mv: jest.fn().mockReturnValue(true)
                }
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
        expect(log.mock.calls[0][0]).toBe("Please input the ingredients.");
        expect(log.mock.calls[1][0]).toBe("Please input the directions.");
        expect(log.mock.calls[2][0]).toBe("Please fill up everythingsss.");
        expect(req.flash.mock.calls).toEqual([["error_msg", "Please input the ingredients.\rPlease input the directions."]]);
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

        expect(log).toHaveBeenCalledWith("Please fill up everything.", "imageUploadFile.mv is not a function");
        expect(req.flash.mock.calls).toEqual([["error_msg", "imageUploadFile.mv is not a function"]]);
        expect(res.redirect.mock.calls).toEqual([['/home#addRecipe-container']]);
        log.mockClear();
        log.mockRestore();
    });
});

describe('delete recipe Validator', () => {

    it('successful delete recipe', () => {
        const req = {
            query: {
                id: "123456789"
            },

            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
            status: jest.fn(),
        };

        db.findOne.mockImplementationOnce((Recipe, query, projection, result) => result(true));
        db.deleteOne.mockImplementationOnce((Recipe, query, flag) => flag(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.deleteRecipe(req, res);

        expect(log).toHaveBeenCalledWith("Successfully deleted recipe.");
        expect(res.redirect.mock.calls).toEqual([['home']]);
        log.mockClear();
        log.mockRestore();
    });

    it('failed try catch delete, go to error', () => {
        const req = {
            /*
            query: {
                id: "123456789"
            },
            */

            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res),
        };

        //db.findOne.mockImplementationOnce((Recipe, query, projection, result) => result(true));
        //db.deleteOne.mockImplementationOnce((Recipe, query, flag) => flag(true));

        const log = jest.spyOn(global.console, 'log');

        jest.spyOn(fs, 'unlink').mockImplementation((uploadPath, err) => err(false));

        profileController.deleteRecipe(req, res);

        expect(log).toHaveBeenCalledWith("An error has occur recipe delete failed.");
        expect(res.status.mock.calls).toEqual([[500]]);
        expect(res.send.mock.calls).toEqual([["Cannot read properties of undefined (reading 'id')"]]);
        expect(res.redirect.mock.calls).toEqual([['home']]);
        log.mockClear();
        log.mockRestore();
    });
});

describe('show recipe Validator', () => {

    it('successful show recipe', () => {
        const req = {
            params: {
                id: "123456789"
            },

            flash: jest.fn(),
        };

        const res = {
            render: jest.fn(),
            status: jest.fn(),
        };

        db.findOne.mockImplementationOnce((Recipe, query, projection, result) => result(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.showRecipe(req, res);

        expect(log).toHaveBeenCalledWith("Successfully show recipe.");
        expect(res.render.mock.calls).toEqual([['recipePage', {"recipe": true}]]);
        log.mockClear();
        log.mockRestore();
    });

    it('failed try catch show, go to error', () => {
        const req = {
            /*
            query: {
                id: "123456789"
            },
            */

            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res),
        };

        //db.findOne.mockImplementationOnce((Recipe, query, projection, result) => result(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.showRecipe(req, res);

        expect(log).toHaveBeenCalledWith("An error has occur recipe show failed.");
        expect(res.status.mock.calls).toEqual([[500]]);
        expect(res.send.mock.calls).toEqual([["Cannot read properties of undefined (reading 'id')"]]);
        expect(res.redirect.mock.calls).toEqual([['home']]);
        log.mockClear();
        log.mockRestore();
    });
});

describe('get edit recipe page', () => {

    it('show all recipe info', () => {
        const req = {
            query: {
                idname: "123456789"
            },

            flash: jest.fn(),
        };

        const res = {
            render: jest.fn(),
            status: jest.fn(),
        };

        db.findOne.mockImplementationOnce((Recipe, query, projection, result) => result(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.getEditRecipe(req, res);

        expect(log).toHaveBeenCalledWith("Successfully show all edit recipe info.");
        expect(res.render.mock.calls).toEqual([['editRecipe', {"recipe": true}]]);
        log.mockClear();
        log.mockRestore();
    });

    it('failed try catch edit recipe, go to error', () => {
        const req = {
            /*
            query: {
                idname: "123456789"
            },
            */

            flash: jest.fn(),
        };

        const res = {
            redirect: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res),
        };

        //db.findOne.mockImplementationOnce((Recipe, query, projection, result) => result(true));

        const log = jest.spyOn(global.console, 'log');

        profileController.getEditRecipe(req, res);

        expect(log).toHaveBeenCalledWith("An error has occur get recipe edit failed.");
        expect(res.status.mock.calls).toEqual([[500]]);
        expect(res.send.mock.calls).toEqual([["Error Occurred"]]);
        expect(res.redirect.mock.calls).toEqual([['home']]);
        log.mockClear();
        log.mockRestore();
    });
});