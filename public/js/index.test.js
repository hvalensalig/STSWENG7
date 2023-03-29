const userController = require('../../controllers/userController');
const user = require('../../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

jest.mock('../../models/users');
jest.mock('express-validator');

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
        jest.spyOn(bcrypt, 'compare').mockImplementation((pass, salt, cb) => cb(null, false));

        validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: "Username is required!" }, { msg: "Password is required!" }])
        }));
        await userController.login(req, res);

        expect(req.flash.mock.calls).toEqual([["error_msg", "Username is required!\r\nPassword is required!"]]);
        expect(res.redirect.mock.calls).toEqual([['/login']]);
        expect(log).toHaveBeenCalledWith('There is error in the inputs');
        log.mockClear();
        log.mockRestore();
    });
});