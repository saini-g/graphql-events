const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { parseUser } = require('./helper');

module.exports = {
    users: async () => {

        try {
            User.testMethod();
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
    login: async (args, req) => {
        const user = await User.findOne({ email: args.email });

        if (!user) {
            throw new Error('user not found!');
        }
        const isPasswordCorrect = await bcrypt.compare(args.password, user.password);

        if (!isPasswordCorrect) {
            throw new Error('invalid credentials!');
        }
        const token = jwt.sign({ userId: user.distinct, email: user.email }, 'my-private-key', { expiresIn: '2h' });
        return {
            userId: user.id,
            token: token,
            expiresIn: 2
        };
    }
};