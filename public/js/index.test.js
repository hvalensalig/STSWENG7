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
}),

describe('Login Input Validator', () => {

    it('When user does not exist', async () => {
        const req = {
            body: {
                username: "jasper",
                password: "123456789",
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
        await userController.login(req, res);

        expect(req.flash.mock.calls).toEqual([["error_msg", "Username does not exist!"]]);
        expect(res.redirect.mock.calls).toEqual([['/login']]);
        expect(log).toHaveBeenCalledWith('Username does not exist');
        log.mockClear();
        log.mockRestore();
    });

    it('When user exist and password is correct', async () => {
        const req = {
            body: {
                username: "jasper",
                password: "123456789",
            },
            session: {
                username: "",
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => ({
            toObject: jest.fn().mockReturnValue({ username: "jasper", password: "123456789"})
        }));
        
        const log = jest.spyOn(global.console, 'log');
        jest.spyOn(bcrypt, 'compare').mockImplementation((pass, salt, cb) => cb(null, true));

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
        await userController.login(req, res);

        expect(res.redirect.mock.calls).toEqual([['/home']]);
        expect(log).toHaveBeenCalledWith('Logged In');
        log.mockClear();
        log.mockRestore();
    });

    it('When user exist and password is incorrect', async () => {
        const req = {
            body: {
                username: "jasper",
                password: "123456782",
            },
            session: {
                username: "",
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => ({
            toObject: jest.fn().mockReturnValue({ username: "jasper", password: "123456789"})
        }));
        
        const log = jest.spyOn(global.console, 'log');
        jest.spyOn(bcrypt, 'compare').mockImplementation((pass, salt, cb) => cb(null, false));

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([{ msg: "" }])
        }));
        await userController.login(req, res);

        expect(req.flash.mock.calls).toEqual([["error_msg", "Incorrect password!"]]);
        expect(res.redirect.mock.calls).toEqual([['/login']]);
        expect(log).toHaveBeenCalledWith('Wrong password');
        log.mockClear();
        log.mockRestore();
    });

    it('When login input error', async () => {
        const req = {
            body: {
                username: "jasper",
                password: "123456789",
            },

            flash: jest.fn(),
        };
        
        const res = {
            redirect: jest.fn(),
        };

        user.findOne.mockImplementationOnce(() => (null));
        
        const log = jest.spyOn(global.console, 'log');
        jest.spyOn(bcrypt, 'compare').mockImplementation((pass, salt, cb) => cb());

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: "Username is required!" }, { msg: "Password is required!" }])
        }));
        await userController.login(req, res);

        expect(req.flash.mock.calls).toEqual([["error_msg", "Username is required!\rPassword is required!"]]);
        expect(res.redirect.mock.calls).toEqual([['/login']]);
        expect(log).toHaveBeenCalledWith('There is error in the inputs');
        log.mockClear();
        log.mockRestore();
    });
}),

describe('Logout Validator', () => {

    it('When logut is a successs', () => {
        const req = {
            session: {
                username: "jasper",
                destroy: jest.fn().mockImplementation((fn) => fn()),
            },
        };
        
        const res = {
            clearCookie: jest.fn(),
            redirect: jest.fn(),
        };
        
        const log = jest.spyOn(global.console, 'log');

        userController.logoutUser(req, res);

        expect(res.redirect.mock.calls).toEqual([["/login"]]);
        expect(log).toHaveBeenCalledWith('User logged out');
        log.mockClear();
        log.mockRestore();
    });
});