var bookinDate = document.getElementsByClassName("bookinDate");
var timeIn = document.getElementsByClassName("timeIn");
var timeOut = document.getElementsByClassName("timeOut");


const optionTime = { hour: '2-digit', minute: '2-digit' };
const optionDay = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

for (var i = 0; i < bookinDate.length; i++) {
    var noEST = new Date(bookinDate[i].innerHTML);
    var date1 = noEST.toLocaleDateString('en-US', optionDay);
    bookinDate[i].innerHTML = `${date1}`;
}
for (var i = 0; i < timeIn.length; i++) {
    var justHourIn = new Date(timeIn[i].innerHTML);
    var date2 = justHourIn.toLocaleTimeString('en-US', optionTime);
    timeIn[i].innerHTML = `${date2}`;
}
for (var i = 0; i < timeOut.length; i++) {
    var justHourOut = new Date(timeOut[i].innerHTML);
    var date3 = justHourOut.toLocaleTimeString('en-US', optionTime);
    timeOut[i].innerHTML = `${date3}`;
}



