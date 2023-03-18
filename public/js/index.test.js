const userController = require('../../controllers/userController');
const user = require('../../models/users');

jest.mock('../../models/users');

describe('Register Input Validator', () => {

    it('When username already exist', async () => {
        const req = {
            body: {
                username: "jasper",
                password: "123456789",
                rePassword: "123456789",
            },

            flash: jest.fn((x) => x),
        };
        
        const res = {
            redirect: jest.fn((x) => x),
        };

        user.findOne.mockImplementationOnce(() => ("jasper"));
        
        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);

        expect(log).toHaveBeenCalledWith('Username is already in use');
        log.mockClear();
        log.mockRestore();
    });

    it('When new password is not the same', async () => {
        const req = {
            body: {
                username: "roy",
                password: "123456789",
                rePassword: "1234567890",
            },

            flash: jest.fn((x) => x),
        };
        
        const res = {
            redirect: jest.fn((x) => x),
        };

        user.findOne.mockImplementationOnce(() => (null));
        
        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);

        expect(log).toHaveBeenCalledWith('Password not the same');
        log.mockClear();
        log.mockRestore();
    });

    /*
    it('When new user', async () => {
        const req = {
            body: {
                username: "roy",
                password: "123456789",
                rePassword: "123456789",
            },

            flash: jest.fn((x) => x),
        };
        
        const res = {
            redirect: jest.fn((x) => x),
        };

        user.findOne.mockImplementationOnce(() => (null));

        user.create.mockImplementationOnce(() => ({
            username: "roy",
            password: "123456789",
        }))

        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);

        expect(log).toHaveBeenCalledWith('registered');
        log.mockClear();
        log.mockRestore();
    });

    it('When registration input error', async () => {
        const req = {
            body: {
                username: "roy",
                password: "123456789",
                rePassword: "123456789",
            },

            flash: jest.fn((x) => x),
        };
        
        const res = {
            redirect: jest.fn((x) => x),
        };

        user.findOne.mockImplementationOnce(() => (null));

        const log = jest.spyOn(global.console, 'log');

        await userController.register(req, res);
        expect(log).toHaveBeenCalledWith('There is error in the inputs');
        log.mockClear();
        log.mockRestore();
    });
    */
});