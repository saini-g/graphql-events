const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { parseBooking } = require('./helper');

module.exports = {
    bookings: async () => {

        try {
            const bookings = await Booking.find();
            return bookings.map(booking => parseBooking(booking));
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {

        try {
            const event = await Event.findById(args.eventId);

            if (!event) {
                throw new Error('event not found!');
            }
            const newBooking = new Booking({
                user: '5cb324a9ca1ab019880cb790',
                event: event
            });
            const result = await newBooking.save();
            return parseBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {

        try {
            const booking = await Booking.findById(args.bookingId);

            if (!booking) {
                throw new Error('booking not found!');
            }
            const result = await Booking.deleteOne({ _id: booking.id });
            return 'booking cancelled!';
        } catch (err) {
            throw err;
        }
    }
};