const Event = require('../../models/event');
const User = require('../../models/user');
const { parseEvent } = require('./helper');

module.exports = {
    events: async () => {
        // can use "return Event.find().populate('created_by').then..." to get created_by data
        // but it only provides one level of nesting

        // fetching user/events data manually prevents mongoose from falling into
        // an infinite loop but also allowing the user to drill down as many levels as needed
        // because now we fetch related data only when client asks for it

        try {
            const events = await Event.find();
            return events.map(ev => parseEvent(ev));
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('auth failed!');
        }

        try {
            const newEvent = new Event({
                title: args.evInput.title,
                description: args.evInput.description,
                price: +args.evInput.price,
                date: new Date(args.evInput.date),
                created_by: req.userId
            });
            // this approach is for handling operations on multiple objects
            // can be replaced by transactions
            const saveResult = await newEvent.save();
            const user = await User.findById(req.userId);
            user.created_events.push(newEvent);
            await user.save();
            return parseEvent(saveResult);;
        } catch (err) {
            throw err;
        }
    }
};