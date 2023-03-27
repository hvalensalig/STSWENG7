const userController = require('../../controllers/userController');
const user = require('../../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { registerValidation } = require('../../validators.js');

jest.mock('../../models/users');

describe('Register Input Validator', () => {

    it('When username already exist', async () => {
        const req = {
            body: {
                firstname: "josh",
                lastname: "seeker",
                location: "Philippines",
                username: "josh",
                password: "123456789",
                rePassword: "123456789",
            },

            flash: jest.fn(),
        };
        
        const res = { 
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => ("josh"));

        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);

        expect(req.flash.mock.calls).toEqual([['error_msg', 'Username is already in use.']]);
        expect(res.redirect.mock.calls).toEqual([['/register']]);
        expect(log).toHaveBeenCalledWith('Username is already in use');
        log.mockClear();
        log.mockRestore();
    });

    it('When new password is not the same', async () => {
        const req = {
            body: {
                firstname: "josh",
                lastname: "seeker",
                location: "Philippines",
                username: "roy",
                password: "123456789",
                rePassword: "1234567890",
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);

        expect(req.flash.mock.calls).toEqual([['error_msg', 'Password is not the same.']]);
        expect(res.redirect.mock.calls).toEqual([['/register']]);
        expect(log).toHaveBeenCalledWith('Password not the same');
        log.mockClear();
        log.mockRestore();
    });

    
    it('When new user', async () => {
        const req = {
            body: {
                username: "roy",
                password: "123456789",
                rePassword: "123456789",
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => (null));

        user.create.mockImplementationOnce(() => ({
            username: "roy",
            password: "123456789",
        }))

        const log = jest.spyOn(global.console, 'log');
        jest.spyOn(bcrypt, 'hash').mockImplementation((pass, salt, cb) => cb());

        await userController.register(req, res);
        expect(res.redirect.mock.calls).toEqual([["/register"]]);
        expect(log).toHaveBeenCalledWith('registered');
        log.mockClear();
        log.mockRestore();
    });

    it('When registration input error', async () => {
        const req = {
            body: {
                username: null,
                password: null,
                rePassword: null,
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => (null));
        //validationResult.mockImplementationOnce(() => ([]));

        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);
        
        //expect(req.flash.mock.calls).toEqual([["error_msg", "Password is not the same."]]);
        expect(res.redirect.mock.calls).toEqual([['/register']]);
        expect(log).toHaveBeenCalledWith('There is error in the inputs');
        log.mockClear();
        log.mockRestore();
    });
});