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
    createEvent: async args => {

        try {
            const newEvent = new Event({
                title: args.evInput.title,
                description: args.evInput.description,
                price: +args.evInput.price,
                date: new Date(args.evInput.date),
                created_by: '5cb324a9ca1ab019880cb790'
            });
            // this approach is for handling operations on multiple objects
            // can be replaced by transactions
            const saveResult = await newEvent.save();
            const user = await User.findById('5cb324a9ca1ab019880cb790');
            user.created_events.push(newEvent);
            await user.save();
            return parseEvent(saveResult);;
        } catch (err) {
            throw err;
        }
    }
};