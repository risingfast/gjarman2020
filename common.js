// common.js -- common functions shared across web pages
// Author: Geoff Jarman
// Started: 14-May-2022
// Log: 
//    14-May-2022 start and test
//    18-Jun-2022 add fSetCornerImage()
//    18-Jun-2022 step up uri number
//    20-Jun-2022 add fFetchOptions()
//    20-Jun-2022 prefix common functions 'fc'.....()
//    23-Jun-2022 add fcGetDecrementCornerImage()
//    23-Jun-2022 add fcGetFirstCornerImage()
//    27-Jun-2022 flag and comment deprepecated functions
//    27-Jun-2022 remove deprepecated functions
//    21-Jul-2022 add fcCheckAuthentication

// define uri's for cgi database fetches

const uri101 = "http://www.risingfast.com/cgi-bin/setCornerImage.cgi";           // fetch list of images
const uri102 = "http://www.risingfast.com/cgi-bin/utilitiesFetchOptions.cgi";
const uri105 = "http://www.risingfast.com/cgi-bin/utilitiesFetchOptions.cgi";
const uri106 = "http://www.risingfast.com/cgi-bin/saveCornerImageNumber.cgi";
const uri107 = "http://www.risingfast.com/cgi-bin/fetchCornerImageNumber.cgi";
const uri108 = "http://www.risingfast.com/cgi-bin/checkAuthentication.cgi";

// function to display and hide help
  
function fcShowHelp() {
    var x = document.getElementById("HELPDIV");
    if (x.style.display === "") {
        x.style.display = "block";
    } else {
        x.style.display = "";
    }
}

function fcClearExtras() {
    var x = document.getElementById("HELPDIV");
    x.style.display = "";
    var y = document.getElementById("internals-details");
    y.removeAttribute("open");
}

// function to fetch and set a new corner image and caption randomly

async function fcSetRandomCornerImage() {
    let response = await fetch(uri101);                          // fetch the list of corner images
    if (response.ok) {
        let text = await response.text();
        let array = text.split("\n");
        array.pop();
        let intRecords = array.length/3;
        let intRecordSelected = Math.trunc(Math.random() * intRecords);
        if (intRecordSelected === 0) {
            intRecordSelected = 1;
        }
        document.getElementById("ASIDE2IMG").src=array[(intRecordSelected - 1) * 3];
        document.getElementById("ASIDE3-PARA").innerHTML=array[((intRecordSelected - 1) * 3) + 1];
        fcSaveCornerImageNumber(intRecordSelected);              // save the new corner image number
    } else {
        alert("HttpError: " + response.status);
    }
}

// function to fetch a locked corner image. The stored corner image number is not changed

async function fcSetLockedCornerImage() {
    let iRecordNo = 0;
    let response1 = await fetch(uri107);          // fetch the corner image number from mySQL
    if (response1.ok) {
        let text = await response1.text();
        iRecordNo = parseInt(text, 10);
    } else {
        alert("HttpError: " + response1.status);
    }
    let response2 = await fetch(uri101);          // fetch a listing of all corner images
    if (response2.ok) {
        let text = await response2.text();
        let array = text.split("\n");
        array.pop();
        document.getElementById("ASIDE2IMG").src=array[(iRecordNo - 1) * 3];
        document.getElementById("ASIDE3-PARA").innerHTML=array[((iRecordNo - 1) * 3) + 1];
    } else {
        alert("HttpError: " + response2.status);
    }
}

async function fcSaveCornerImageNumber(iRecordNumber) {
    sArg = uri106 + '?' + 'number=' + iRecordNumber; 
    let response = await fetch(sArg);
    return;
}

// function to fetch and set a new corner image and caption sequentially

async function fcIncrementCornerImage() {
    let iCurrentImageNo = 0;
    let response1 = await fetch(uri107);                                       // fetch the corner image number from mySQL
    if (response1.ok) {
        let text = await response1.text();
        iCurrentImageNo = parseInt(text, 10);
    } else {
        alert("HttpError: " + response1.status);
    }
    let response2 = await fetch(uri101);                                        // fetch the list of all corner images
    if (response2.ok) {
        let text = await response2.text();
        let array = text.split("\n");
        let iMaxRecords = array.length/3;
        let iNextImageNo = (iCurrentImageNo + 1) % (iMaxRecords + 1);
        if (iNextImageNo === 0) {
            iNextImageNo++;
        }
        document.getElementById("ASIDE2IMG").src=array[(iNextImageNo - 1) * 3]
        document.getElementById("ASIDE3-PARA").innerHTML=array[((iNextImageNo - 1) * 3) + 1];
        fcSaveCornerImageNumber(iNextImageNo);                               // save the new corner image number
    } else {
        alert("HttpError: " + response.status);
    }
}

// function to fetch and set a new corner image and caption sequentially

async function fcDecrementCornerImage() {
    let iCurrentImageNo = 0;
    let response1 = await fetch(uri107);                                       // fetch the corner image number from mySQL
    if (response1.ok) {
        let text = await response1.text();
        iCurrentImageNo = parseInt(text, 10);
    } else {
        alert("HttpError: " + response1.status);
    }
    let response2 = await fetch(uri101);                                       // fetcgh the list of all corner images
    if (response2.ok) {
        let text = await response2.text();
        let array = text.split("\n");
        let iMaxRecords = array.length/3;
        let iNextImageNo = (iCurrentImageNo - 1) % (iMaxRecords + 1);
        if (iNextImageNo < 1) {
            iNextImageNo = iMaxRecords;
        }
        document.getElementById("ASIDE2IMG").src=array[(iNextImageNo - 1) * 3]
        document.getElementById("ASIDE3-PARA").innerHTML=array[((iNextImageNo - 1) * 3) + 1];
        fcSaveCornerImageNumber(iNextImageNo);                                 // save the new corner image number
    } else {
        alert("HttpError: " + response.status);
    }
}

// function to fetch and set a new corner image and caption sequentially

async function fcFirstCornerImage() {
    let response = await fetch(uri101);                                        // fetch the list of corner images
    if (response.ok) {
        let text = await response.text();
        let array = text.split("\n");
        let iCurrentImageNo = 1;
        document.getElementById("ASIDE2IMG").src=array[(iCurrentImageNo - 1) * 3]
        document.getElementById("ASIDE3-PARA").innerHTML=array[((iCurrentImageNo - 1) * 3) + 1];
        fcSaveCornerImageNumber(iCurrentImageNo);                              // save the new corner image number
    } else {
        alert("HttpError: " + response.status);
    }
}

// function to fetch option settings and set them on the page footer 

async function fcSetFooterOptions() {
    let response = await fetch(uri105);
    if (response.ok) {
        var options= [];
        let text = await response.text();
        let array = text.split("\n");
        array.pop();                      // remove the last element (empty element) created by the split("\n")
        for (let i = 0; i < array.length; i++)
        {
            options[i] = array[i].split(",");
        }
        let x = options.length;
        let y = options[1].length;
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                options[i][j] = options[i][j].trim();
            }
        }
        options[4][2] = parseInt(options[4][2], 10);
    } else {
        alert("HttpError: " + response.status);
    }
    document.getElementById("footeroptionscichoice").innerHTML = options[0][2];
    document.getElementById("footeroptionsbackgroundimage").innerHTML = options[1][2];
    document.getElementById("MAIN1").style.backgroundImage = "url(" + options[1][2].toString() + ".jpg)";
    document.getElementById("footeroptionsshowuser").innerHTML = options[2][2];
    document.getElementById("footeroptionsshowlog").innerHTML = options[3][2];
    if (document.getElementById("footeroptionscichoice").innerHTML == "Locked") {
        ;
    } else if (document.getElementById("footeroptionscichoice").innerHTML == "Randomized") {
        fcSetRandomCornerImage();
    } else if (document.getElementById("footeroptionscichoice").innerHTML == "Sequenced") {
        fcIncrementCornerImage();
    }
    return;
}

// fetch the current option settings from mySQL and fetch a new corner image

async function fcSetCornerImage() {

    let response = await fetch(uri105);
    if (response.ok) {
        var options= [];
        let text = await response.text();
        let array = text.split("\n");
        array.pop();
        for (let i = 0; i < array.length; i++)
        {
            options[i] = array[i].split(",");
        }
        let x = options.length;
        let y = options[1].length;
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                options[i][j] = options[i][j].trim();
            }
        }
        options[4][2] = parseInt(options[4][2], 10);
    } else {
        alert("HttpError: " + response.status);
    }
    let sCornerImageBehaviour = options[0][2];
    let sCornerImageNumber = options[4][2];

    if (sCornerImageBehaviour == "Locked") {
        fcSetLockedCornerImage();
    } else if (sCornerImageBehaviour == "Randomized") {
        fcSetRandomCornerImage();
    } else if (sCornerImageBehaviour == "Sequenced") {
        fcIncrementCornerImage();
    }
    return;
}


//  function to authenticate a session by checking for a session cookie

async function fcCheckAuthentication() {
    let response = await fetch(uri108);
    if (response.ok) {
        let text = await response.text();
        let text1 = text.split("\n");
        if (text1[0] === "Success") {
            document.getElementById("unsecured-div").style.display="none";
            document.getElementById("secured-div").style.display="block";
            document.getElementById("SESSION1PARA").innerHTML="Session: " + text1[1] + "<BR>User: " + text1[2] + "<BR>Name: " + text1[3] + "<BR>" + text1[4] + "<BR>At: " + text1[5];
        } else {
            document.getElementById("secured-div").style.display="none";
            document.getElementById("unsecured-div").style.display="block";
            document.getElementById("SESSION1PARA").innerHTML='No authenticated user';
        }
    }
}

