var bookinDatenoYear = document.getElementsByClassName("bookinDatenoYear");
var textroomid = document.getElementsByClassName("text-roomid");
var textcompid = document.getElementsByClassName("text-compid");


const optionDayNoYear = { weekday: 'long', month: 'long', day: 'numeric'};
for (var i = 0; i < bookinDatenoYear.length; i++) {
    var justYearOut = new Date(bookinDatenoYear[i].innerHTML);
    var date4 = justYearOut.toLocaleDateString('en-US', optionDayNoYear);
    bookinDatenoYear[i].innerHTML = `${date4}`;
}

for (var i = 0; i < textroomid.length; i++) {
    var str = textroomid[i].innerHTML;
    console.log(str);
    textroomid[i].innerHTML = str.slice(0,4) + " " + str.slice(4);
}
for (var i = 0; i < textcompid.length; i++) {
    var str = textcompid[i].innerHTML;
    console.log(str);
    textcompid[i].innerHTML = str.slice(6,10).toUpperCase() + " " + str.slice(10);
}   