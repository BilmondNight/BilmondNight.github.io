
var currentTab = 0;
showTab(currentTab);

function showTab(n) {
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    fixStepIndicator(n)
}

function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    if (n == 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;

    if (currentTab >= x.length) {
        showList();
        visible();
    }
    showTab(currentTab);
}

function validateForm() {
    var x, y, z, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    for (i = 0; i < y.length; i++) {
        if (y[i].value == "") {
            y[i].className += " invalid";
            valid = false;
        }
    }

    if(!(document.getElementById("check1").checked) &&  currentTab == x.length - 1){
        valid = false;
        alert("Please agree !");
    }

    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid;
}

function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    x[n].className += " active";
}

function showRange() {
    var swim = document.getElementById('swim').value;
    document.getElementById('showSwim').innerHTML = swim;
    var surf = document.getElementById('surf').value;
    document.getElementById('showSurf').innerHTML = surf;
}

function showList() {
    var dateIn = document.getElementById('dateIn').value;
    var dateOut = document.getElementById('dateOut').value;
    var adult = document.getElementById('adult').value;
    var children = document.getElementById('children').value;
    var room = document.getElementById('room').value;

    var r1 = document.querySelector('input[name="r1"]:checked').value;
    var r2 = document.querySelector('input[name="r2"]:checked').value;

    var swim = document.getElementById('swim').value;
    var surf = document.getElementById('surf').value;
    var colorSwim = document.getElementById('colorSwim').value;
    var colorSurf = document.getElementById('colorSurf').value;

    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;

    document.getElementById("sfname").innerHTML = fname;
    document.getElementById("slname").innerHTML = lname;
    document.getElementById("semail").innerHTML = email;
    document.getElementById("sdateIn").innerHTML = dateIn;
    document.getElementById("sdateOut").innerHTML = dateOut;
    document.getElementById("sadult").innerHTML = adult;
    document.getElementById("schildren").innerHTML = children;
    document.getElementById("sroom").innerHTML = room;

    if (r1 == "yes") {
        document.getElementById("scook").innerHTML = "Yes";
    }
    if (r1 == "no") {
        document.getElementById("scook").innerHTML = "No";
    }
    if (r2 == "yes") {
        document.getElementById("swifi").innerHTML = "Yes";
    }
    if (r2 == "no") {
        document.getElementById("swifi").innerHTML = "No";
    }

    document.getElementById("sswim").innerHTML = swim;
    swimHTML = "<label style='background-color: " + colorSwim + "; width: 15px; height: 15px; margin: 0 auto'></label>";
    document.getElementById("scolorSwim").innerHTML = swimHTML;

    document.getElementById("ssurf").innerHTML = surf;
    surfHTML = "<label style='background-color: " + colorSurf + "; width: 15px; height: 15px; margin: 0 auto'></label>";
    document.getElementById("scolorSurf").innerHTML = surfHTML;
}

function visible() {
    $(".details").css("visibility", "visible");

    $(".close").click(function () {
        $(".details").css("display", "none");
        location.reload();
    });
}