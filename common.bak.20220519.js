// common.js -- common functions shared across web pages
// Author: Geoff Jarman
// Started: 14-May-2022
// Log: 
//    14-May 2022 start and test
  
// function to display and hide help
  
function fShowHelp() {
    var x = document.getElementById("HELPDIV");
    if (x.style.display === "") {
        x.style.display = "block";
    } else {
        x.style.display = "";
    }
}

function fClearExtras() {
    var x = document.getElementById("HELPDIV");
    x.style.display = "";
    var y = document.getElementById("internals-details");
    y.removeAttribute("open");
}
