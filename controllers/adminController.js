const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Booking = mongoose.model('bookings');

router.get('/admin', (req, res) => {
    res.render("admin/addupdateBooking", {
        viewTitle: "Insert Booking"
    });
});

router.post('/admin', (req, res) => {
    if (req.body._id == '')
    insertBookingRecord(req, res);
    else
        updateBookingRecord(req, res);
});

function insertBookingRecord(req, res) {
    var booking = new Booking();
    booking.booking_id = req.body.booking_id;
    booking.reservedFor = req.body.reservedFor;
    booking.bookingDate = req.body.bookingDate;
    booking.timeIn = req.body.timeIn;
    booking.timeOut = req.body.timeOut;
    booking.numberOfHours = req.body.numberOfHours;
    booking.computer_id = req.body.computer_id;
    booking.room_id = req.body.room_id;
    booking.bookingStatus = req.body.bookingStatus;

    booking.save((err, doc) => {
        if (!err)
            res.redirect('admin/bookingList');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin/addupdateBooking", {
                    viewTitle: "Create Booking",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateBookingRecord(req, res) {
    Booking.updateOne({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('admin/bookingList'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin/addupdateBooking", {
                    viewTitle: 'Update Booking',
                    booking: req.body
                });
            }
            else 
                console.log('Error during record edit : ' + err);
        }
    });
}

router.get('/admin/bookingList', (req, res) => {
    Booking.find((err, docs) => {
        if (!err) {
            res.render("admin/bookingList", {
                bookingList: docs
            });
        }
        else {
            console.log('Error in retrieving emp list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'booking_id':
                body['booking_idError'] = err.errors[field].message;
                break;
            case 'reservedFor':
                body['reservedForError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Booking.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("admin/addupdateBooking", {
                viewTitle: "Update Booking",
                booking: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Booking.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/admin/bookingList');
        }
        else {
            console.log('Error in booking remove :' + err);
        }
    });
});
 
module.exports = router;