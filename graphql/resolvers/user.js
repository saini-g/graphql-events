const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const { parseUser } = require('./helper');

module.exports = {
    users: async () => {

        try {
            const users = await User.find();
            return users.map(user => parseUser(user));
        } catch (err) {
            throw err;
        }
    },
    createUser: async args => {

        try {
            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {
                throw new Error('duplicate email id');
            }
            const pwHash = await bcrypt.hash(args.userInput.password, 12);
            const newUser = new User({
                email: args.userInput.email,
                password: pwHash
            });
            const saveResult = await newUser.save();
            return parseUser(saveResult);
        } catch (err) {
            throw err;
        }
    },
    login: async (args, req) => {}
};