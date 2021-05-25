var rooms = [];
var limit = 0;
var rc;
var db = firebase.database();
var user = localStorage.getItem("user");
var currentroom = localStorage.getItem("roomname");
var roomindex = localStorage.getItem("index");
var msg = 0;
var messages = [], senders = [];
var rows;
var msgLimit = 0;
var updateMessage = 0;
var load = 0;
var users;
var recive = new Audio("recive.mp3");
var succesfully = new Audio("sent.mp3")

// db.ref("roomCount").on("value",function(data){
//     rc = data.val();
// })
db.ref("rooms").on("value",function(data){
    users = data.val();
});

function draw(){
    if(limit === 0) {
        for(var i = 1; i < rc+1; i++) {
            db.ref("rooms/room"+i+"/roomdetails/room").on("value",function(data){
             rooms.push(data.val());
            }) 
            limit = 1;
         }
    }
    if(limit === 1) {
        for(i = 1; i < msg+1; i++) {
            db.ref("rooms/room"+roomindex+"/messages/message"+i+"/message").on("value",function(data){
                messages.push(data.val());
            })
            db.ref("rooms/room"+roomindex+"/messages/message"+i+"/sender").on("value",function(data){
                senders.push(data.val());
            })
            if(i === msg) {
                limit = 2;
                load = 1;
            }
        }
    }
    showMessages();
    
}
db.ref("rooms/room"+roomindex+"/messages/messageCount").on("value",function(data) {
    msg = data.val();
})

function showMessages(){
    if(msgLimit === 0 && messages.length === msg) {
        for(var i = 0; i < messages.length; i++) {
            rows = "<div class='conversation'><b class 'textbold'>&nbsp;&nbsp; "+senders[i]+"</b>&nbsp;<img class='user_tick' src='tick.png'/><br><b class='user_message'><p style='margin-left: 20px; line-height: 15px'>"+messages[i]+"</p></b></div>"
            document.getElementById("box").innerHTML += rows;
            if(i !== messages.length-1) {
                document.getElementById("box").innerHTML += "<hr>"
            }
            if(i === messages.length-1){
                window.scrollTo(0,document.body.scrollHeight);
            }   
            msgLimit = 1;
        }
    } 
    
    
}
setInterval(function(){
    if(msgLimit === 1 && messages.length !== msg) {
        updateMessage = 1
    }
    if(updateMessage === 1) {
        if(messages.length !== msg) {
            db.ref("rooms/room"+roomindex+"/messages/message"+msg+"/sender").on("value",function(data){
                senders.push(data.val());
            })
            db.ref("rooms/room"+roomindex+"/messages/message"+msg+"/message").on("value",function(data){
                messages.push(data.val());
                rows = "<div class='conversation'><b class 'textbold'>&nbsp;&nbsp; "+senders[msg-1]+"</b>&nbsp;<img class='user_tick' src='tick.png'/><br><b class='user_message'><p style='margin-left: 20px; line-height: 15px'>"+messages[msg-1]+"</p></b></div>"
            })
            window.scrollTo(0,document.body.scrollHeight);
            updateMessage = 2;
        }  
    }
    if(updateMessage === 2 && messages.length === msg) {
        if(msg-2 !== messages.length-1) {
            document.getElementById("box").innerHTML += "<hr>"
        }
       
        document.getElementById("box").innerHTML += rows;
        if(senders[senders.length-1] !== user) {
            recive.play();
        } else if(senders[senders.length-1] === user) {
            succesfully.play();
        }
        if(msg-1 !== messages.length-1) {
            document.getElementById("box").innerHTML += "<hr>"
        }
        updateMessage = 0;
    }
    
},1000)

setTimeout(function(){
    setInterval(() => {
        if(limit === 2) {
            var localroomindex = rooms.indexOf(localStorage.getItem("roomname"));
            var localindex = localStorage.getItem("index");
            if(localStorage.getItem("user") === null ||
            localStorage.getItem("index") === null ||
            localStorage.getItem("roomname") === null ||
            localStorage.getItem("user") === "" ||
            localStorage.getItem("index") === "" ||
            localStorage.getItem("roomname") === "") {
                window.location.replace("../../");
            } else if(currentroom !== rooms[localindex-1] ||
                localStorage.getItem("user") !== user ||
                localStorage.getItem("roomname") !== currentroom) {
                window.location.replace("../../");;
            }
        }
    }, 1000);
},3000)


//code
function send(){
    var usermsg = document.getElementById("message").value;
    if(usermsg !== "") {
        msg += 1;
        db.ref("rooms/room"+roomindex+"/messages").update({
            messageCount: msg,
        })
        db.ref("rooms/room"+roomindex+"/messages/message"+msg).update({
            message: usermsg,
            sender: user,
        })
        document.getElementById("message").value = "";
        
    }
}
function loaded() {
    setInterval(function(){
        if(load === 1) {
            document.getElementById("loading").style.display = 'none';
        }
},1000)
}
function logout(){
    localStorage.removeItem("index");
    localStorage.removeItem("roomname");
    window.location.replace("../../")
}