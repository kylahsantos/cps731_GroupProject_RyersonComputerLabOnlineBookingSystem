var { MongoClient } = require('mongodb'); // import mongoclient field from the mongodb space

//for hashing passwords
var bcrypt = require("bcrypt");
const { MongoTimeoutError } = require('mongodb');
var url = 'mongodb+srv://dbUser:M1NX8PFarE8B7ggY@cluster0.y9lk9.mongodb.net/cps731?retryWrites=true&w=majority';

var db = null;
var client = null;
/*
Function for connecting to the 'cps731' database
*/
//tells js to wait for this to connect [await]
async function connect() {
    if (db == null) {
        var options = {
            useUnifiedTopology: true,
        };
        client = await MongoClient.connect(url, options);
        db = await client.db("cps731");
    }
    return db;
}

/*
Function for registering a user to 'users' db
*/
async function register(username, password) {
    var conn = await connect();
    var collection_name = "users";
    var existingUser = await conn.collection(collection_name).findOne({ username });
    var totalNumberofHours = 0; 
    if (existingUser != null) {
        //will not continue if error is thrown
        throw new Error('User already exists!');
    }
    //to hide passwords
    var SALT_ROUNDS = 10;
    var passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    conn.collection(collection_name).insertOne({ username, passwordHash, totalNumberOfHours});
}

/*
Function for logging in a user
*/ 
async function login(username, password){
    var conn = await connect();
    var database_name = "users";
    var user = await conn.collection(database_name).findOne({ username });

    //if user does not exist
    if (user == null) { 
        throw new Error('User does not exist!');
    }

    var validatePassword = await bcrypt.compare(password, user.passwordHash);

    //check if password matches
    if (!validatePassword){
        throw new Error('Invalid password!');
    } else {
        console.log("User: " + username + " logged in successfully.");
    }
}

/*
Function to get user role
*/
async function getUserRole(username){
    var conn = await connect();
    var database_name = "users";
    var user = await conn.collection(database_name).findOne({ username });

    var userRole = user.role;

    console.log("User role: " + userRole);

    return userRole;
}

/*
Function to get username
*/
async function getUsername(username){
    var conn = await connect();
    var database_name = "users";
    var user = await conn.collection(database_name).findOne({ username });

    var userName = user.username;

    console.log("Username: " + userName);

    return userName;
}

/*
Function to get hours
*/
async function getHours(username){
    var conn = await connect();
    var database_name = "users";
    var user = await conn.collection(database_name).findOne({ username });

    var userHours = user.totalNumberOfHours;

    console.log("Number of Hours: " + userHours);

    return userHours;
}

/*
Function to adjust user hours after cancelling a booking
*/
async function adjustHours(uniqueid){
    var conn = await connect();
    var database_name = "users";
    var ObjectId = require('mongodb').ObjectId; 
    var id = uniqueid;       
    var o_id = new ObjectId(id);
    var booking = await conn.collection("bookings").findOne({ _id: o_id });
    
    var bookedHours = booking.numberOfHours;
    var reservedFor = booking.reservedFor;
    var user = await conn.collection(database_name).findOne({ username: reservedFor });
    
    console.log(user);

    var userHours = user.totalNumberOfHours;

    var userHours = userHours - bookedHours;
    var updateUserHours = await conn.collection("users").update({username: reservedFor}, {$set: {totalNumberOfHours: userHours}});
}

/* 
Function to get # of computers available
*/
async function getComputersAvailable(pickDate, startTime, labID){
    var conn = await connect();
    var database_name = "bookings";
    pickDate = new Date(pickDate);
    var timePlaceHolder = new Date(pickDate);

    timePlaceHolder.setHours(startTime);

    console.log("pickDate: " + pickDate);

    console.log("timeIn: " + timePlaceHolder);

    var numberOfComputersTaken = await conn.collection(database_name).countDocuments({bookingDate: pickDate, timeIn: timePlaceHolder, room_id: labID})
    
    var availableComputers = 8 - numberOfComputersTaken;

    console.log("comp " + availableComputers);

    return availableComputers;
}

/*Function to check if computer is available*/
async function isCompAvailable(pickDate, startTime, computerID){
    var conn = await connect();
    var database_name = "bookings";
    pickDate = new Date(pickDate);
    var timePlaceHolder = new Date(pickDate);

    var result = "";

    timePlaceHolder.setHours(startTime);

    //console.log("db.js pickDate: " + pickDate);

    //console.log("db.js timeIn: " + timePlaceHolder);

    var isAvailable = await conn.collection(database_name).countDocuments({bookingDate: pickDate, timeIn: timePlaceHolder, computer_id: computerID})

    if (isAvailable == 0) {
        result = "true";
    }
    else
        result = "notAvailable";

    return result;
}

//getComputersAvailable("2021-12-01T05:00:00.000+00:00", "9", "room1");

/*
Function to check if user has existing booking
*/
async function checkBookingExists(day, time, user){
    var conn = await connect();
    var database_name = "bookings";
   
    day = new Date(day);

    var timePlaceHolder = new Date(day);

    var result = "";

    timePlaceHolder.setHours(time);

    var bookingExists = await conn.collection(database_name).countDocuments({bookingDate: day, timeIn: timePlaceHolder, reservedFor: user})

    if (bookingExists == 1) {
        result = "BookingExists";
    }
    else
        result = "BookingDoesNotExist";

    console.log(result);

    return result;
}

//checkBookingExists("2021-12-02T05:00:00.000+00:00", "9", "kylah.santos");

/*Function to delete booking*/
async function updateProgressBooking(username){
    var conn = await connect();
    var database_name = "bookings";
    const query = { reservedFor: username, bookingStatus: "inProgress" };

    //
    const result = await conn.collection(database_name).deleteOne(query);
        
    if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
    } else {
        console.log("No documents matched the query. Deleted 0 documents.");
    }
}
/*
Function to get studentBookings
*/
async function getStudentBookingsDB(username){
    var conn = await connect();
    var database_name = "bookings"; 
    return new Promise((resolve, reject) => {
        conn.collection(database_name).find({ reservedFor: username, bookingStatus: "confirmed" }).toArray((err,res)=>
        {
            if(err){
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};


/*
Function to add a new booking to the db
*/
async function addBooking(bookingID, reservedFor, bookingDay, startTime, endTime, compID, roomID){
    var conn = await connect();
    var database_name = "bookings";
    var username = reservedFor;
    //find inProgress booking
    var booking = await conn.collection(database_name).findOne({ bookingStatus: "inProgress",  reservedFor });
    
    console.log("booking" + booking)
    
    var datePicked = new Date (bookingDay);
    
    //startTime
    var timeIn = new Date(bookingDay);
    timeIn.setHours(startTime);

    //endTime
    var timeOut = new Date(bookingDay);
    timeOut.setHours(endTime);

    const bookingDuration = timeOut.getTime() - timeIn.getTime();
    const totalHoursBooked = (Math.floor((bookingDuration)/1000))/3600;

    console.log("timeIn: " +  timeIn);
    console.log("timeOut: " +  timeOut);
    console.log("totalHoursBooked: " +  totalHoursBooked);

    //check if user can book
    var user = await conn.collection("users").findOne({ username });

    //check if user has enough hours to book on date picked
    var existingBookings = await conn.collection(database_name).findOne({ bookingDate: datePicked, bookingStatus: "confirmed",  reservedFor: username });
    var bookingsCount = await conn.collection(database_name).find({ bookingDate: datePicked, bookingStatus: "confirmed",  reservedFor: username }).count();
    console.log("bookingsCount" + bookingsCount)
    var userHours = user.totalNumberOfHours + totalHoursBooked;
    var newBooking;
    var updateUserHours = null;
    var existingHours = 0;
    if (existingBookings == null){
        existingHours = 0;
    } else {
        existingHours = existingBookings.numberOfHours;
    }

    //if existingBooking hour is 1 //check if totalNumberOfHours for user does not exceed 8
    if (!(user.totalNumberOfHours == 8)){
        if ((existingHours <= 1 && totalHoursBooked == 1 && userHours <= 8 && bookingsCount <= 2) || (existingHours == 0 && totalHoursBooked <=2)) {
        console.log("line202");
        //update inProgress booking to confirmed
        newBooking = await conn.collection(database_name).update({booking_id: bookingID}, 
            {$set: {timeIn: timeIn, timeOut: timeOut, numberOfHours: totalHoursBooked, computer_id: compID, room_id: roomID, bookingStatus: "confirmed"}});
        
        console.log(newBooking)
        //update userHours
        updateUserHours = await conn.collection("users").update({username: reservedFor}, {$set: {totalNumberOfHours: userHours}});
        }
    //if existingBooking hour is 2
    else if( (user.totalNumberOfHours >= 8)) {
        if ((existingHours >= 1 && totalHoursBooked <= 2)){
        //delete inProgress booking return error to user
        const query = { booking_id: bookingID };
        //const booking = await conn.collection(database_name).find({booking_id: bookingID});
        const result = await conn.collection(database_name).deleteOne(query);
            if (result.deletedCount == 1) {
                console.log("Successfully deleted one document.");
                newBooking = null;
            } else {
            console.log("No documents matched the query. Deleted 0 documents.");
            }
        }
        }
    }
    return newBooking;
}

/*
Function to get computers db
*/ 
async function getComputersDB(){
    var conn = await connect();
    var database_name = "computers"; 
    return new Promise((resolve, reject) => {
        conn.collection(database_name).find({}).toArray((err,res)=>
        {
            if(err){
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

/*
Function to store pickedDate from user
*/
async function storePickedDate(day, username){
    var conn = await connect();
    var database_name = "bookings"; 

    var bookingID = "";

    //check booking_id generated is unique in db 
    var checkBookingID = null;
    
    do {
        checkBookingID = await conn.collection(database_name).findOne({ bookingID });
        //console.log(checkBookingID);
        bookingID = generateString(10);
        //console.log("line 81");
        console.log("line 82" + bookingID);
    } while (checkBookingID != null);

    var startTime = "00";
    var endTime = "00";
    var totalHoursBooked = 0;
    var comp_id = "n/a";
    var labRoom_id = "n/a";

    var bookingDay = new Date(day);

    console.log("bookingDay: " + bookingDay);

    var newBooking = {booking_id: bookingID, reservedFor: username, bookingDate: bookingDay, timeIn: startTime, timeOut: endTime, numberOfHours: totalHoursBooked, computer_id: comp_id, room_id: labRoom_id, bookingStatus: "inProgress" };

    conn.collection(database_name).insertOne(newBooking, function(err, res) {
        if (err) throw err;
          console.log("New booking added");
       });
    
    return bookingID;
}

/*
Function to get picked date
*/
async function getPickedDate(username){
    var conn = await connect();
    var database_name = "bookings";
    var reservedFor = username;
    var checkBookingID = await conn.collection(database_name).findOne({ bookingStatus: "inProgress",  reservedFor });
    var dayPicked = checkBookingID.bookingDate;
    return dayPicked;
}

/*
Function to get bookingid
*/
async function getBookingID(username){
    var conn = await connect();
    var database_name = "bookings";
    var reservedFor = username;
    var checkBookingID = await conn.collection(database_name).findOne({ bookingStatus: "inProgress",  reservedFor });
    var bookingID = checkBookingID.booking_id;
    return bookingID;
}

/*
Function to get bookings db
*/ 
async function getBookingsDB(){
    var conn = await connect();
    var database_name = "bookings"; 
    conn.collection(database_name).find({}).toArray(function(err, result)
    {
        if (err) throw err;
        console.log(result);
    });
};

/*
Function to generate random strings for the booking ids
*/
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/*
Function to update bookings db
*/

module.exports = {
    login, 
    addBooking,
    getComputersDB,
    getBookingsDB,
    getUserRole,
    getUsername,
    getHours,
    storePickedDate,
    getPickedDate,
    getComputersAvailable,
    isCompAvailable,
    getBookingID,
    addBooking,
    checkBookingExists,
    updateProgressBooking,
    getStudentBookingsDB,
    adjustHours,
    url,
}

//login("admin", "admin123!");
//addBooking("2021-11-19","kylah.santos", "2021-11-19T09:00:00.000+00:00", "2021-11-19T11:00:00.000+00:00", "room1_compA","room1");
//getBookingsDB();