const Event = require('../../models/event');
const User = require('../../models/user');

const fetchUser = async userId => {

    try {
        let user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            created_events: fetchEvents.bind(this, user._doc.created_events)
        };
    } catch (err) {
        throw err;
    }
}

const fetchSingleEvent = async eventId => {

    try {
        const event = await Event.findById(eventId);
        return parseEvent(event);
    } catch (err) {
        throw err;
    }
}

const fetchEvents = async eventIds => {

    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(ev => parseEvent(ev));
    } catch (err) {
        throw err;
    }
}

const parseUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        password: null,
        created_events: fetchEvents.bind(this, user._doc.created_events)
    };
}

const parseEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toLocaleDateString(),
        created_by: fetchUser.bind(this, event.created_by)
    };
}

const parseBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        createdAt: new Date(booking._doc.createdAt).toLocaleDateString(),
        updatedAt: new Date(booking._doc.updatedAt).toLocaleDateString(),
        event: fetchSingleEvent.bind(this, booking.event),
        user: fetchUser.bind(this, booking.user)
    };
}

module.exports = {
    parseUser,
    parseEvent,
    parseBooking
};