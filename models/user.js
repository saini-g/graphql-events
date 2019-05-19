const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    created_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});
userSchema.statics.testMethod = () => {
    console.log('I am from a static method!');
}
module.exports = mongoose.model('User', userSchema);