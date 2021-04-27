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

db.ref("roomCount").on("value",function(data){
    rc = data.val();
})

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
            limit = 2;
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
            rows = "<div class='conversation'><b class 'textbold'>&nbsp;&nbsp; "+senders[i]+"</b>&nbsp;<img class='user_tick' src='tick.png'><br><b class='user_message'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+messages[i]+"</b></div>"
            document.getElementById("box").innerHTML += rows;
            if(i !== messages.length-1) {
                document.getElementById("box").innerHTML += "<hr>"
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
                rows = "<div class='conversation'><b class 'textbold'>&nbsp;&nbsp; "+senders[msg-1]+"</b>&nbsp;<img class='user_tick' src='tick.png'><br><b class='user_message'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+messages[msg-1]+"</b></div>"
            })
            updateMessage = 2;
            if(updateMessage === 2 && messages.length === msg) {
                // if(msg-1 !== messages.length-1) {
                //     document.getElementById("box").innerHTML += "<hr>"
                // }
               
                document.getElementById("box").innerHTML += rows;
                // if(msg !== messages.length-1) {
                //     document.getElementById("box").innerHTML += "<hr>"
                // }
                updateMessage = 0;
            }
        }  
    }
    
},1000)



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
        
        if(messages.length !== msg) {
            for(var i = msg; i < msg+1; i++) {
                db.ref("rooms/room"+roomindex+"/messages/message"+i+"/message").on("value",function(data){
                    messages.push(data.val());
                })
                db.ref("rooms/room"+roomindex+"/messages/message"+i+"/sender").on("value",function(data){
                    senders.push(data.val());
                })
                
            }
            if(messages.length === msg) {
                for(var i = msg-1; i < msg; i++) {
                    if(i-1 !== messages.length-1) {
                        document.getElementById("box").innerHTML += "<hr>"
                    }
                    rows = "<div class='conversation'><b class 'textbold'>&nbsp;&nbsp; "+senders[i]+"</b>&nbsp;<img class='user_tick' src='tick.png'><br><b class='user_message'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+messages[i]+"</b></div>"
                    document.getElementById("box").innerHTML += rows;
                    if(i !== messages.length-1) {
                        document.getElementById("box").innerHTML += "<hr>"
                    }
                }
            }
        }
        
    }
}


