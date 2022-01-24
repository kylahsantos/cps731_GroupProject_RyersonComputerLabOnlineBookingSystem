require("../models/dbConfig.js");
var express = require("express");
var router = express.Router();
var db = require("../db");
const mongoose = require('mongoose');
const Booking = mongoose.model('bookings');
const adminController = require('../controllers/adminController');
//var session = require("express-session");

/* GET login page. */
router.get("/login", function(req, res, next) {
  console.log("GET LOGIN PAGE");
  res.render("login", { title: 'Ryerson Computer Lab Booking System Login' });
});

/* POST process login page */
router.post("/login", async function(req, res){
  //"input" names from FORM
  var { username, password } = req.body;
  
  console.log(username, password);
  
  await db.login(username, password);
  
  req.session.username = username;

  req.session.save((err) => {
    if (!err) {
        console.log(req.session);
    }
  });

  var userRole = await db.getUserRole(username);
  if (userRole == "admin") { 
    //console.log("ok"); 
    res.redirect('/admin');
  } else {
    res.redirect('/');
  }
});

/* ENSURE LOGGED IN FUNCTION */
function ensureLoggedIn(req, res, next){
  if (req.session.username==null) {
    console.log("Not logged in.");
    res.redirect('/login');
  } else {
    next();
  }
}

router.use(ensureLoggedIn);

/* GET home page for STUDENT. */
router.get('/', async function(req, res, next) {
  
  var loggedInUser = req.session.username;

  var bookedHours = await db.getHours(loggedInUser);

  var remainingHours = 8 - bookedHours;

  console.log(loggedInUser);

  var studentBookingsCollectionIndex = await db.getStudentBookingsDB(loggedInUser);

  res.render('index', { title: 'Ryerson Computer Lab Booking System', loggedInUser, bookedHours, remainingHours, studentBookingsCollectionIndex});
});

/* GET CALENDAR page for STUDENT. */
router.get('/calendar', function(req, res, next){
  res.render('calendar', {title: 'Ryerson Computer Lab Booking System - Calendar'});
  console.log("Ryerson Computer Lab Booking System - Calendar");
});

/* POST CALENDAR page for STUDENT. */
router.post('/calendar', async function(req, res){
  var { datePicked } = req.body;
  console.log("Ryerson Computer Lab Booking System - Calendar post");
  console.log(datePicked);
  var loggedInUser = req.session.username;
  var dayPicked = await db.storePickedDate(datePicked, loggedInUser);

  console.log(dayPicked);
  res.redirect('/bookaRoom');
});

/* GET bookaRoom page for STUDENT. */
router.get('/bookaRoom', async function(req, res, next){
  //var { day_selected } = req.body;
  var loggedInUser = req.session.username;

  var getPickedDay = await db.getPickedDate(loggedInUser);

  getPickedDay = getPickedDay.toDateString();

  res.render('bookaRoom', {title: 'Book A Room', getPickedDay});

  console.log("Book A Room");
  //console.log("-> " + day_selected);
});

router.post('/timeChosen', async function(req, res) {
  var loggedInUser = req.session.username;

  var timeChose = req.body.timeChoice;

  var getPickedDay = req.body.getPickedDay;

  var estTime = parseInt(timeChose) + 7;

  console.log("timeChose: " + timeChose);
  console.log("estTime: " + estTime);

  var getPickedDay = await db.getPickedDate(loggedInUser);

  if (getPickedDay == null){
    await db.storePickedDate(getPickedDay, loggedInUser);
  }

  var roomOne = await db.getComputersAvailable(getPickedDay, estTime, "room1");
  var roomTwo = await db.getComputersAvailable(getPickedDay, estTime, "room2");
  var roomThree = await db.getComputersAvailable(getPickedDay, estTime, "room3");

  getPickedDay = getPickedDay.toDateString();

  var timePlaceHolder = new Date(getPickedDay);

  timePlaceHolder.setHours(estTime);

  var timeText = timePlaceHolder;

  timeText = timeText.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  //check if user has a booking at this time already
  var checkBookingExists = await db.checkBookingExists(getPickedDay, estTime, loggedInUser);

  console.log("checkBookingExists: " + checkBookingExists);
  
  //if user already has booking at this time then alert user
  if (checkBookingExists=="BookingExists"){
    var message = "You have an existing booking at this time, please select a different time.";
    //delete inProgress booking
    //await db.deleteBooking(loggedInUser);
    res.render('bookaRoom', {title: 'Book A Room', message, timeText, getPickedDay, estTime, roomOne, roomTwo, roomThree, checkBookingExists});
  }
  else{
    res.render('bookaRoom', {title: 'Book A Room', timeText, getPickedDay, estTime, roomOne, roomTwo, roomThree});
  }
});

router.post('/labRoomChoice', async function(req, res) {
  console.log(req.body);
  var loggedInUser = req.session.username;
  var labRoomChosen = req.body.labRoomChosen;
  var timeChose = req.body.timeChoice;
  var getPickedDay = await db.getPickedDate(loggedInUser);
  var getBookingId = await db.getBookingID(loggedInUser);

  var getComputersAvailable = await db.getComputersAvailable(getPickedDay, timeChose, labRoomChosen); 

  console.log("labRoomChosen: "+ req.body.labRoomChosen);
  console.log("timeChoice: "+ req.body.timeChoice);

  var startTime = parseInt(timeChose);

  var firstHour = parseInt(timeChose) + 1;

  console.log('firsthour'+ firstHour);

  var pickDate = new Date(getPickedDay);

  /*firstHour text*/
  var timePlaceHolder = new Date(pickDate);

  timePlaceHolder.setHours(firstHour);

  var firstHourText = timePlaceHolder;

  firstHourText = firstHourText.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  /*secondhour text*/
  var secondHour = parseInt(timeChose) + 2;

  var timePlaceHolderTwo = new Date(pickDate);

  timePlaceHolderTwo.setHours(secondHour);

  var secondHourText = timePlaceHolderTwo;

  secondHourText = secondHourText.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  /*timechose text*/
  var timePlaceHolderThree = new Date(pickDate);

  timePlaceHolderThree.setHours(startTime);

  var timeChoseText = timePlaceHolderThree;

  timeChoseText = timeChoseText.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
 
  var compA = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compA");
  var compB = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compB");
  var compC = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compC");
  var compD = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compD");
  var compE = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compE");
  var compF = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compF");
  var compG = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compG");
  var compH = await db.isCompAvailable(getPickedDay, startTime, labRoomChosen+"_compH");

  console.log("compA " + compA);

  res.render('bookaComputer', {title: 'Book A Computer', getBookingId, loggedInUser, getPickedDay, timeChose, timeChoseText, labRoomChosen, getComputersAvailable, firstHour, secondHour, firstHourText, secondHourText, compA, compB, compC, compD, compE, compF, compG, compH})
});

router.post('/newBooking', async function(req, res) {
  var loggedInUser = req.session.username;
  console.log(req.body);
  var booking_id= req.body.booking_id;
  var reservedFor = req.body.reservedFor;
  var bookingDate = req.body.bookingDate;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var comp_id = req.body.chosenComputerID;
  var roomID = req.body.room_id;

  var userBooking = await db.addBooking(booking_id, reservedFor, bookingDate, startTime, endTime, comp_id, roomID);

  if (userBooking == null){
    await db.updateProgressBooking(loggedInUser);
    throw new Error('You have exceeded the amount of hours available to book.');
  }else{
    res.redirect('/');
  }
})

/* GET bookaComputer page for STUDENT. */
router.get('/bookaComputer', async function(req, res, next){

  console.log(req.body);

  var timeChose = req.body.timeChoice;

  res.render('bookaComputer', {title: 'Book A Computer', timeChose});
  console.log("Book A Computer");
});

/* GET studentBookings page for STUDENT. */
router.get('/studentBookings', async function(req, res, next){
  var loggedInUser = req.session.username;

  var studentBookingsCollection = await db.getStudentBookingsDB(loggedInUser);
  
  console.log(studentBookingsCollection);

  console.log("Your Bookings");
  
  res.render('studentBookings', {title: 'Your Bookings', studentBookingsCollection});
});

/* GET account page for STUDENT. */
router.get('/account', async function(req, res, next){

  var loggedInUser = req.session.username;

  var bookedHours = await db.getHours(loggedInUser);

  console.log("Line 81: Your Account");
  
  res.render('account', {title: 'Your Account', loggedInUser, bookedHours});
});

/*GET admin page*/
router.get('/admin', (req, res) => {
  var user = req.session.username; 
  Booking.find((err, docs) => {
      if (!err) {
          res.render("admin/bookingList", {layout: 'adminlayout',
              bookingList: docs, user
          });
      }
      else {
          console.log('Error in retrieving booking list :' + err);
      }
  });
});

/* GET computersList page for ADMIN. */
router.get('/admin/computersList', async function(req, res, next) {

  var user = req.session.username; 
  
  var computersCollection = await db.getComputersDB();

  res.render('admin/computersList', { layout: 'adminlayout', title: 'ADMIN VIEW: Ryerson Computer Lab Booking System', user, computersCollection});

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
            res.redirect('/admin');
        else{
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin/addupdateBooking", {
                   layout: 'adminlayout',
                    title: "Create Booking",
                    booking: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateBookingRecord(req, res) {
    Booking.updateOne({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/admin'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("admin/addupdateBooking", {
                    title: 'Update Booking',
                    booking: req.body
                });
            }
            else 
                console.log('Error during record edit : ' + err);
        }
    });
}

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

router.get('/admin/:id', (req, res) => {
  //res.redirect("/admin");
  console.log(Booking);
  console.log(req.params.id);
    Booking.findById(req.params.id, (err, doc) => {
        if (!err) {
            console.log("no error!");
            res.render("admin/addupdateBooking", {
                layout: 'adminlayout',
                title: "Update Booking",
                booking: doc
            });
        } else {
          console.log("error!");
          insertBookingRecord(req, res);
        }
    });
});

router.get('/admin/delete/:id', async function(req, res){
  //var loggedInUser = req.session.username;

  //update userhours
  await db.adjustHours(req.params.id);
    Booking.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            console.log("DELETE - NO ERROR");
            res.redirect('/admin');
        }
        else {
            console.log('Error in booking remove :' + err);
        }
    });
});

router.get('/student/delete/:id', async function(req, res){
  //var loggedInUser = req.session.username;
  console.log(req.params.id);
   //update userHours
  await db.adjustHours(req.params.id);
  
  Booking.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          console.log("DELETE - NO ERROR");
          res.redirect('/');
      }
      else {
          console.log('Error in booking remove :' + err);
      }
  });
});

router.post('/booking', (req, res) => {
  if (req.body._id == '')
      insertBookingRecord(req, res);
  else
      updateBookingRecord(req, res);
});

/* POST logout user. */
router.post("/logout", async function(req, res){
  req.session.username=null;
  res.redirect('/login');
});

/* POST logout user. */
router.post("/admin/logout", async function(req, res){
  req.session.username=null;
  res.redirect('/login');
});

module.exports = router;