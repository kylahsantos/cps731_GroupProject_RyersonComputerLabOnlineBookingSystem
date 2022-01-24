const calendar = document.querySelector("#app-calendar");
const daynames = document.querySelector("#daynames");
const month_title = document.querySelector("#month");
var month = new Date().getMonth();
var year = new Date().getFullYear(); //0 = January... 11 = December


const isInvalid = (day, yy, mm) => {
    if (isOld(day, yy, mm) || isfortnightAway(day, yy, mm)) {
        return true;
    }
    else {
        return false;
    }
}

const isfortnightAway = (day, yy, mm) => {
    var fortnightAway = new Date(Date.now() + 12096e5);
    const checkDate = new Date(yy, mm, day);
    return checkDate > fortnightAway;
}

const isOld = (day, yy, mm) => {

    const checkDate = new Date(yy, mm, day);

    const today = new Date();
    return checkDate < today;
}

const isToday = (day, yy, mm) => {
    const checkDate = new Date(yy, mm, day).toDateString();
    console.log("Check Date: " + checkDate);
    const today = new Date().toDateString();

    console.log("Today: " + today);
    console.log(checkDate == today);
    return checkDate == today;
}

const totalDaysinMonth = () => {
    const rightMonth = month + 1; //you need the next month 
    var d = new Date(year, rightMonth, 0); //0 will return the month-1
    return d.getDate();
}

const getNameofDays = day => {
    const date = new Date(year, month, day);
    const dayName = date.toLocaleDateString("en-US", { weekday: 'long' });
    return dayName;
}

const getCalendarTitle = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    return monthNames[month] + " " + year;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function change(direction) {
    if (direction == 'left') {
        month -= 1;

        month_title.innerHTML = getCalendarTitle();
        removeAllChildNodes(calendar);
        //ADD DAY NAMES AT THE TOP 
        for (let day = 1; day <= 7; day++) {
            const dayName = getNameofDays(day);
            calendar.insertAdjacentHTML("beforeend", `<div class="name">${dayName}</div>`)
        }

        //ADD DAYS OF MONTH
        for (let day = 1; day <= totalDaysinMonth(); day++) {

            // const weekend = isWeekend(day);

            const today = isToday(day, year, month);
            var yesterday = isOld(day, year, month) || isfortnightAway(day, year, month);
            calendar.insertAdjacentHTML("beforeend", `<div class ="day ${today ? "today" : " "} ${yesterday ? "yesterday" : ""}">${day}</div>`)
        }
        const selectedday = [year, month];
        //SELECT ONLY ONE DAY AND ADD CLASS=SELECTED
        document.querySelectorAll("#app-calendar .day").forEach(
            day => {
                day.addEventListener("click", event => {
                    var selectedElement = document.querySelector(".selected");
                    var isdayBefore = isInvalid(parseInt(event.target.innerHTML), year, month);
                    if (isdayBefore == false) {
                        event.target.classList.add("selected");
                        if (selectedElement) {
                            selectedElement.classList.remove("selected");
                        }
                        if (event.target.classList.contains("selected")) {
                            var day_selected = event.target.innerHTML;
                            document.getElementById("day_selected").value = day_selected;
                            console.log(document.getElementById("day_selected").value);
                            var datePicked = year + "-" + month + "-" + document.getElementById("day_selected").value;

                            console.log(datePicked);

                            const pickedDay = new Date(year, month, document.getElementById("day_selected").value);

                            console.log(pickedDay);

                            //day_selected = pickedDay;

                            document.getElementById("datePicked").value = pickedDay;
                            console.log(document.getElementById("datePicked").value);
                            //console.log(datePicked.data('date'))
                            //console.log(document.getElementById("month_selected").value);
                            //console.log(document.getElementById("day_selected").value);
                        }
                    }

                }, false);
            }
        );



    }
    else if (direction == 'right' && month < 11) {
        month += 1;
        month_title.innerHTML = getCalendarTitle();
        console.log(month_title.innerHTML);
        removeAllChildNodes(calendar);
        //ADD DAY NAMES AT THE TOP 
        for (let day = 1; day <= 7; day++) {
            const dayName = getNameofDays(day);
            calendar.insertAdjacentHTML("beforeend", `<div class="name">${dayName}</div>`)
        }
        //ADD DAYS OF MONTH
        for (let day = 1; day <= totalDaysinMonth(); day++) {

            // const weekend = isWeekend(day);

            const today = isToday(day, year, month);
            var yesterday = isOld(day, year, month) || isfortnightAway(day, year, month);
            calendar.insertAdjacentHTML("beforeend", `<div class ="day ${today ? "today" : " "} ${yesterday ? "yesterday" : ""}">${day}</div>`)
        }
        const selectedday = [year, month];
        //SELECT ONLY ONE DAY AND ADD CLASS=SELECTED
        document.querySelectorAll("#app-calendar .day").forEach(
            day => {
                day.addEventListener("click", event => {
                    var selectedElement = document.querySelector(".selected");
                    var isdayBefore = isInvalid(parseInt(event.target.innerHTML), year, month);
                    if (isdayBefore == false) {
                        event.target.classList.add("selected");
                        if (selectedElement) {
                            selectedElement.classList.remove("selected");
                        }
                        if (event.target.classList.contains("selected")) {
                            var day_selected = event.target.innerHTML;
                            document.getElementById("day_selected").value = day_selected;
                            console.log(document.getElementById("day_selected").value);
                            var datePicked = year + "-" + month + "-" + document.getElementById("day_selected").value;

                            console.log(datePicked);

                            const pickedDay = new Date(year, month, document.getElementById("day_selected").value);

                            console.log(pickedDay);

                            //day_selected = pickedDay;

                            document.getElementById("datePicked").value = pickedDay;
                            console.log(document.getElementById("datePicked").value);
                            //console.log(datePicked.data('date'))
                            //console.log(document.getElementById("month_selected").value);
                            //console.log(document.getElementById("day_selected").value);
                        }
                    }

                }, false);
            }
        );



    }
    console.log("out" + month);

}


//--------------Logic------------------------
//SET MONTH HEADER
month_title.insertAdjacentText("afterbegin", getCalendarTitle());

//ADD DAY NAMES AT THE TOP 
for (let day = 1; day <= 7; day++) {
    const dayName = getNameofDays(day);
    calendar.insertAdjacentHTML("beforeend", `<div class="name">${dayName}</div>`)
}

const monthNamesList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

var monthTitle = monthNamesList[month];

//ADD DAYS OF MONTH
for (let day = 1; day <= totalDaysinMonth(); day++) {

    // const weekend = isWeekend(day);

    const today = isToday(day, year, month);
    var yesterday = isOld(day, year, month) || isfortnightAway(day, year, month);
    calendar.insertAdjacentHTML("beforeend", `<div class ="day ${yesterday ? "yesterday" : ""} ${today ? "today" : ""}">${day}</div>`)
}
const selectedday = [year, month];
//SELECT ONLY ONE DAY AND ADD CLASS=SELECTED
document.querySelectorAll("#app-calendar .day").forEach(
    day => {
        day.addEventListener("click", event => {
            var selectedElement = document.querySelector(".selected");
            var isdayBefore = isInvalid(parseInt(event.target.innerHTML), year, month);
            if (isdayBefore == false) {
                event.target.classList.add("selected");
                if (selectedElement) {
                    selectedElement.classList.remove("selected");
                }
                if (event.target.classList.contains("selected")) {
                    var day_selected = event.target.innerHTML;
                    document.getElementById("day_selected").value = day_selected;
                    console.log(document.getElementById("day_selected").value);
                    var datePicked = year + "-" + month + "-" + document.getElementById("day_selected").value;

                    console.log(datePicked);

                    const pickedDay = new Date(year, month, document.getElementById("day_selected").value);

                    console.log(pickedDay);

                    //day_selected = pickedDay;

                    document.getElementById("datePicked").value = pickedDay;
                    console.log(document.getElementById("datePicked").value);
                    //console.log(datePicked.data('date'))
                    //console.log(document.getElementById("month_selected").value);
                    //console.log(document.getElementById("day_selected").value);
                }
            }

        }, false);
    }
);
