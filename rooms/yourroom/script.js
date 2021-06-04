var msgCount;
var db;
db = firebase.database();
var user = localStorage.getItem("user");
var currentroom = localStorage.getItem("roomname");
var roomindex = localStorage.getItem("index");
var meta;
var rows;
var rooms
var recive = new Audio("recive.mp3");
var succesfully = new Audio("sent.mp3");
var limit = 0;

db.ref("rooms/"+currentroom+"/messages/messageCount").on("value", function(data){
    msgCount = data.val();
});

db.ref("rooms").on("value", function(data){
    rooms = data.val();
});

db.ref("rooms/"+currentroom+"/messages").on("value", function(data){
    meta = data.val();
});

setInterval(() => {
    if(msgCount === Object.keys(meta).length-1) {
        showMessages();
    }
}, 100);

function showMessages() {
    if(limit === 0) {
        for(let i = 1; i < Object.keys(meta).length; i++) {
            rows = "<div class='conversation' id="+i+"><b class 'textbold'>&nbsp;&nbsp; "+meta['message'+i]['sender']+"</b>&nbsp;<img class='user_tick' src='tick.png'/><br><b class='user_message'><p style='margin-left: 20px; line-height: 15px'>"+meta['message'+i]['message']+"</p></b></div>";
            document.getElementById('box').innerHTML += rows;
            if(i !== Object.keys(meta).length-1) {
                document.getElementById("box").innerHTML += "<hr>"
            }
            if(i === Object.keys(meta).length-1) {
                window.scrollTo(0,document.body.scrollHeight);
            }
            limit = 1;
        }
    }
}

function send() {
    var message = document.getElementById('message').value;
    if(message !== '') {
        msgCount += 1;
        db.ref("rooms/"+currentroom+"/messages").update({
            messageCount: msgCount
        });
        db.ref("rooms/"+currentroom+"/messages/message"+msgCount).update({
            'sender': user,
            'message': message
        });
        document.getElementById('message').value = '';
    }
}

setInterval(() => {
    if(limit === 1) {
        if(document.getElementById(msgCount) === null) {
            rows = "<div class='conversation' id="+msgCount+"><b class 'textbold'>&nbsp;&nbsp; "+meta['message'+msgCount]['sender']+"</b>&nbsp;<img class='user_tick' src='tick.png'/><br><b class='user_message'><p style='margin-left: 20px; line-height: 15px'>"+meta['message'+msgCount]['message']+"</p></b></div>";
            document.getElementById('box').innerHTML += "<hr>";
            document.getElementById("box").innerHTML += rows;

                window.scrollTo(0,document.body.scrollHeight);

            
            if(meta['message'+msgCount]['sender'] !== user) {
                recive.play();
            } else if(meta['message'+msgCount]['sender'] === user) {
                succesfully.play();
            }
        }
        for(let i = 1; i < Object.keys(meta).length; i++) {
            if(document.getElementById(i) === null) {
                rows = "<div class='conversation' id="+i+"><b class 'textbold'>&nbsp;&nbsp; "+meta['message'+i]['sender']+"</b>&nbsp;<img class='user_tick' src='tick.png'/><br><b class='user_message'><p style='margin-left: 20px; line-height: 15px'>"+meta['message'+i]['message']+"</p></b></div>";
                document.getElementById("box").innerHTML += rows;
            }
        }
    }
}, 100);

setInterval(() => {
    if(limit === 1) {
        if(localStorage.getItem("user") === null ||
        localStorage.getItem("index") === null ||
        localStorage.getItem("roomname") === null ||
        localStorage.getItem("user") === "" ||
        localStorage.getItem("index") === "" ||
        localStorage.getItem("roomname") === "") {
            window.location.replace("../../");
        } else if(currentroom !== Object.keys(rooms)[roomindex] ||
            localStorage.getItem("user") !== user ||
            localStorage.getItem("roomname") !== currentroom) {
            window.location.replace("../../");;
        }
    }
}, 1000);

function loaded() {
    document.getElementById("loading").style.display = 'none';
}

function logout(){
    localStorage.removeItem("index");
    localStorage.removeItem("roomname");
    window.location.replace("../../")
}