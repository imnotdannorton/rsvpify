'use strict';

var resultObj;
// enable submit listener for enter on find focus
function handleKey(e) {
  e.which = e.which || e.keyCode;
  if (e.which == 13) {
    findEntry();
  }
}
function lookupResponse() {
  resultObj = JSON.parse(this.responseText).results;
  var resString = "<p><h2>Guests:</h2>";
  resultObj.forEach(function (item) {
    // build rsvp inputs
    resString += '<strong>' + item.name + '</strong><br/>';
    resString += '<span>Attending? </span><select id="' + item._id + '_attending">';
    // check attending val and build dropdown
    if (item.attending) {
      resString += '<option value="true" selected>Yes!</option><option value="false">No :(</option>';
    } else {
      resString += '<option value="false" selected>No :(</option><option value="true">Yes!</option>';
    }
    resString += '</select></br>';
    // initialize request fields
    var placeholderTxt = item.request.length > 0 ? item.request : 'REQUEST A SONG';
    var reqTxt = item.request.length > 0 ? item.request : '';
    resString += 'I want to hear: <input type="text" placeholder="' + placeholderTxt + '" value="' + reqTxt + '" id="' + item._id + '_songRequest"></p>';
  });
  document.getElementById("response").innerHTML = resString;
  document.getElementById("updateForm").className = 'active';
}
function findEntry() {
  // look up by rsvp ID
  var id = document.getElementById("rsvpCode").value;
  var req = new XMLHttpRequest();
  req.addEventListener('load', lookupResponse);
  req.open('GET', '/find/' + id);
  req.send();
}
function saveEntries() {
  resultObj.forEach(function (item) {
    // attach rsvp and request val to guest object
    var num = document.getElementById(item._id + "_attending");
    var attendingVal = num.options[num.selectedIndex].value;
    var reqVal = document.getElementById(item._id + "_songRequest").value;
    console.log('request input value is: ', reqVal, 'object value is: ', item.request);
    // if(reqVal != item.request)
    item.attending = attendingVal;
    item.request = reqVal != item.request ? reqVal : item.request;
    updateEntry(item);
  });
}
function updateEntry(item) {
  var body = item;
  var req = new XMLHttpRequest();
  req.addEventListener('load', function () {
    console.log(this.responseText);
    document.getElementById("response").innerHTML = "Thanks for updating!";
    document.getElementById("updateForm").classList.remove("active");
  });
  req.open('POST', '/update', true);
  req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  req.send(JSON.stringify(body));
}
//# sourceMappingURL=form-actions.js.map