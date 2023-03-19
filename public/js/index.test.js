const userController = require('../../controllers/userController');
const user = require('../../models/users');

jest.mock('../../models/users');

describe('Login Input Validator', () => {

    it('When user does not exist', async () => {
        const req = {
            body: {
                username: "jasper",
                password: "123456789",
            },

            flash: jest.fn((x) => x),
        };
        
        const res = {
            redirect: jest.fn((x) => x),
        };

        user.findOne.mockImplementationOnce(() => (null));
        
        const log = jest.spyOn(global.console, 'log');

        await userController.login(req, res);

        expect(log).toHaveBeenCalledWith('Username does not exist');
        log.mockClear();
        log.mockRestore();
    });
});