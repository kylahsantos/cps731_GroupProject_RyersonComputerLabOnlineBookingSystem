const mongoose = require('mongoose');
// bookingsSchema
var bookingsSchema = new mongoose.Schema({
    booking_id: {
        type: String,
        required: 'Please enter booking_id'
    },
    reservedFor: {
        type: String
    },
    bookingDate: {
        type: Date
    },
    timeIn: {
        type: Date
    },
    timeOut: {
        type: Date
    },
    numberOfHours: {
        type: Number
    },
    computer_id: {
        type: String
    },
    room_id: {
        type: String
    },
    bookingStatus: {
        type: String
    }
});
 
mongoose.model('bookings', bookingsSchema);