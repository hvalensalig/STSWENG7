const userController = require('../../controllers/userController');
const user = require('../../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

jest.mock('../../models/users');
jest.mock('express-validator')

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

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
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

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
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
                firstname: "roy",
                lastname: "seeker",
                location: "Philippines",
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

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
        await userController.register(req, res);

        expect(req.flash.mock.calls).toEqual([["success_msg", "You are now Registered."]]);
        expect(res.redirect.mock.calls).toEqual([["/register"]]);
        expect(log).toHaveBeenCalledWith('registered');
        log.mockClear();
        log.mockRestore();
    });

    it('When registration input error', async () => {
        const req = {
            body: {
                firstname: "",
                lastname: "",
                location: "",
                username: "josh",
                password: "123456789",
                rePassword: "123456789",
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: "First Name is required!" }, 
            { msg: "Last Name is required!" }, 
            { msg: "Location is required!" }])
        }));
        await userController.register(req, res);
        
        expect(req.flash.mock.calls).toEqual([["error_msg", "First Name is required!\rLast Name is required!\rLocation is required!"]]);
        expect(res.redirect.mock.calls).toEqual([['/register']]);
        expect(log).toHaveBeenCalledWith('There is error in the inputs');
        log.mockClear();
        log.mockRestore();
    });
});
