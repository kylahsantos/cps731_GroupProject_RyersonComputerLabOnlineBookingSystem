const mongoose = require('mongoose');
 
mongoose.connect('mongodb+srv://dbUser:M1NX8PFarE8B7ggY@cluster0.y9lk9.mongodb.net/cps731?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Connection created.')
    }
    else {
        console.log('Connection failed: : ' + err)
    }
});

// bookings model
require('./bookings.model');	