var resultObj;
// enable submit listener for enter on find focus
function handleKey(e){
  e.which = e.which || e.keyCode;
  if(e.which == 13) {
      findEntry();
  }
}
function lookupResponse(){
  resultObj = JSON.parse(this.responseText).results;
  var resString = ""
  if(resultObj.length > 0){
    resString += "<h2>Guests:</h2>";
    resultObj.forEach(function(item){
    // build rsvp inputs
      resString += '<p><strong>'+item.name+'</strong><br/>';
      resString += '<span>Attending? </span><br/><select id="'+item._id+'_attending">';
      // check attending val and build dropdown
      if(item.attending){
        resString += '<option value="true" selected>Yes!</option><option value="false">No :(</option>';
      }else{
        resString += '<option value="false" selected>No :(</option><option value="true">Yes!</option>';
      }
      resString += '</select></br>';
      // initialize request fields
      var placeholderTxt = item.request.length > 0 ? item.request : 'REQUEST A SONG';
      var reqTxt = item.request.length > 0 ? item.request : '';
      resString += 'Name A Song That Makes You Dance: <br/><input type="text" placeholder="'+placeholderTxt+'" value="'+reqTxt+'" id="'+item._id+'_songRequest"></p>';
    });
  }else{
    resString += "<h2>Could Not Find Guests for Invite "+document.getElementById("rsvpCode").value+"</h2><p>Issues with your RSVP? email Dan: <a href='mailto:norton.dan@gmail.com'>norton.dan@gmail.com</a></p>";
  }
  
  document.getElementById("response").innerHTML = resString;
  document.getElementById("updateForm").className = 'active';
}
function findEntry(){
  // look up by rsvp ID
  var id = document.getElementById("rsvpCode").value.toUpperCase();
  var req = new XMLHttpRequest();
  req.addEventListener('load', lookupResponse)
  req.open('GET', '/find/'+id);
  req.send();
}
function saveEntries(){
  resultObj.forEach( function(item){
    // attach rsvp and request val to guest object
    var num = document.getElementById(item._id+"_attending");
    var attendingVal = num.options[num.selectedIndex].value;
    var reqVal = document.getElementById(item._id+"_songRequest").value
    // if(reqVal != item.request)
    item.attending = attendingVal;
    item.responded = true;
    item.request = reqVal != item.request ? reqVal : item.request;
    updateEntry(item);
  });
}
function updateEntry(item){
  var body = item;
  var req = new XMLHttpRequest();
  req.addEventListener('load', function(){
    document.getElementById("response").innerHTML = "<p>Thanks for updating!</p>";
    document.getElementById("updateForm").classList.remove("active");
  });
  req.open('POST', '/update', true);
  req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  req.send(JSON.stringify(body));
} 