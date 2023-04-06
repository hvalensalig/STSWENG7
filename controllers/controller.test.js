const controller = require('../controllers/controller');
const recipe = require('../models/RecipeModel');
const { validationResult } = require('express-validator');

jest.mock('../models/RecipeModel');
jest.mock('express-validator');

describe('Search Validator', () => {

    it('When search exist', async () => {
        const req = {
            body: {
                search: "food",
            },

            flash: jest.fn(),
        };
        
        const res = { 
            render: jest.fn(),
            redirect: jest.fn(),
        };

        recipe.find.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue("3"),
            length: jest.fn().mockReturnValue("siper"),
        }));

        const log = jest.spyOn(global.console, 'log');

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
        await controller.searchRecipe(req, res);

        expect(req.flash.mock.calls).toEqual([]);
        expect(res.render.mock.calls).toEqual([["search", {"preview": "3"}]]);
        expect(log).toHaveBeenCalledWith('Search Exist');
        log.mockClear();
        log.mockRestore();
    })

    it('When search does not exist', async () => {
        const req = {
            body: {
                search: "food",
            },

            flash: jest.fn(),
        };
        
        const res = { 
            render: jest.fn(),
            redirect: jest.fn(),
        };

        recipe.find.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(""),
            length: jest.fn().mockReturnValue(""),
        }));

        const log = jest.spyOn(global.console, 'log');

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
        await controller.searchRecipe(req, res);

        expect(req.flash.mock.calls).toEqual([['search_error', 'Recipe not found!']]);
        expect(res.render.mock.calls).toEqual([]);
        expect(log).toHaveBeenCalledWith('Search does not Exist');
        log.mockClear();
        log.mockRestore();
    })

    it('When search is empty', async () => {
        const req = {
            body: {
                search: "",
            },

            flash: jest.fn(),
        };
        
        const res = { 
            render: jest.fn(),
            redirect: jest.fn(),
        };

        recipe.find.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(""),
            length: jest.fn().mockReturnValue(""),
        }));

        const log = jest.spyOn(global.console, 'log');

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: "Search input is required!" }])
        }));
        await controller.searchRecipe(req, res);

        expect(req.flash.mock.calls).toEqual([['search_error', 'Search input is required!']]);
        expect(res.redirect.mock.calls).toEqual([['search']]);
        expect(log).toHaveBeenCalledWith('Search input is required');
        log.mockClear();
        log.mockRestore();
    })
});

describe('View Validator', () => {

    it('Return Recipes found', async () => {
        const req = {
            body: {
                _id: 123456788,
                recipeName: "chicken",
                owner: "fred",
            },

            flash: jest.fn(),
        };
        
        const res = { 
            render: jest.fn(),
            redirect: jest.fn(),
        };

        recipe.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue("2"),
        }));

        const log = jest.spyOn(global.console, 'log');

        await controller.viewRecipe(req, res);

        expect(req.flash.mock.calls).toEqual([]);
        expect(res.render.mock.calls).toEqual([['viewRecipe', {"view": "2"}]]);
        expect(log).toHaveBeenCalledWith('View result is displayed');
        log.mockClear();
        log.mockRestore();
    });

    it('Return Recipes not found', async () => {
        const req = {
            body: {
                _id: 123456788,
                recipeName: "chicken",
                owner: "fred",
            },

            flash: jest.fn(),
        };
        
        const res = { 
            render: jest.fn(),
            redirect: jest.fn(),
        };

        recipe.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(null),
        }));

        const log = jest.spyOn(global.console, 'log');

        await controller.viewRecipe(req, res);

        expect(req.flash.mock.calls).toEqual([]);
        expect(res.redirect.mock.calls).toEqual([["search"]]);
        expect(log).toHaveBeenCalledWith('View result is gone');
        log.mockClear();
        log.mockRestore();
    });
});