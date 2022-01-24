const computersFR = document.querySelectorAll("#app-comproom .firstR");
const computersSR = document.querySelectorAll("#app-comproom .secR");

//FIRST ROW
for (let i = 0; i < computersFR.length; i++) {
    computersFR[i].addEventListener("click", event => {
        var selectedElement = document.querySelector(".selectedComp");

        event.target.classList.add("selectedComp");
        
        if (i > 0) {
            computersFR[i - 1].classList.add("disabledComp");

        }
        if (i < 3) {
            computersFR[i + 1].classList.add("disabledComp");

        }
        if (selectedElement) {
            selectedElement.classList.remove("selectedComp");
            if (i > 0) {
                computersFR[i - 1].classList.remove("disabledComp");
    
            }
            if (i < 3) {
                computersFR[i + 1].classList.remove("disabledComp");
    
            }
        }
        if (event.target.classList.contains("selectedComp")) {
        }
    })
}

//SECOND ROW
for (let j = 0; j < computersSR.length; j++) {
    computersSR[j].addEventListener("click", event => {
        var selectedElement = document.querySelector(".selectedComp");

        event.target.classList.add("selectedComp");

        if (j > 0) {
            computersSR[j - 1].classList.add("disabledComp");

        }
        if (j < 3) {
            computersSR[j + 1].classList.add("disabledComp");

        }

        if (selectedElement) {
            selectedElement.classList.remove("selectedComp");
            if (j > 0) {
                computersSR[j - 1].classList.remove("disabledComp");
    
            }
            if (j < 3) {
                computersSR[j + 1].classList.remove("disabledComp");
    
            }

        }



        if (event.target.classList.contains("selectedComp")) {


        }
    })
}

$('.computer').click(function(title, text) {
    $('#chosenComputerID').html($(this).attr("computerTitle"));

    $('#chosenComputerIDinput').val($(this).attr("computerTitle"))
  });

function myFunction() {
    var txt;
    if (confirm("You're booking has been confirmed.")) {
        window.location.href = "/studentBookings"
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
    document.getElementById("demo").innerHTML = txt;
}

function changeColor(id) {
    document.getElementById(id).style.color = "green";
    return false;
}