var user = localStorage.getItem("user");
var greet;
var rc;
var rooms;
var limit = 0;
var rows;
var users;
var db = firebase.database();
var load = 0;

db.ref("users").on("value",function(data){
    users = data.val();
    load = 1;
});
db.ref("rooms").on("value",function(data){
    rooms = data.val();
    trends();
});
function loaded() {
    setInterval(function(){
        if(load === 1) {
            document.getElementById("loading").style.display = 'none';
        }
},1000)
}

    document.getElementById("greet").innerHTML = "Welcome " +user+ " !";
    document.getElementById("addroom").innerHTML = "#Add Room";

    var pc;
    db.ref("playerCount").on("value",function(data){
        pc = data.val();
    });
    var rc;
    db.ref("roomCount").on("value",function(data){
        rc = data.val();
    });
    
    function trends(){
        if(limit === 0) {
            for(var i = 0; i < Object.keys(rooms).length; i++) {
                rows = "<div class='room_name' id="+Object.keys(rooms)[i]+" onclick='redirect(this.id)'  >#"+ Object.keys(rooms)[i] +"</div><br>"
                document.getElementById("box").innerHTML += rows;
                if(i !== Object.keys(rooms).length-1) {
                    document.getElementById("box").innerHTML += "<hr><br>";
                }
                if( i === Object.keys(rooms).length-1) {
                    document.getElementById("box").innerHTML += "<br>";
                }
            }
            limit = 1;
        }
    }
    function redirect(name){
        var passcode = prompt("Password:")
            if(passcode !== null) {
                if(rooms[name]['roomdetails'].password === passcode) {
                    localStorage.setItem("index",Object.keys(rooms).indexOf(name))
                    localStorage.setItem("roomname",name);
                    window.location.replace("./yourroom")
                } else {
                    alert("Incorrect Password")
                }
            }
        
    }
   

function addroom(){
    if(document.getElementById("room_name").value !== "" &&
        document.getElementById("room_password").value !== "") {
            if(rooms.hasOwnProperty(document.getElementById("room_name").value.toLowerCase()) === false &&
               rooms.hasOwnProperty(document.getElementById("room_name").value.toUpperCase()) === false &&
               rooms.hasOwnProperty(document.getElementById("room_name").value) === false) {
                if(document.getElementById("room_name").value.includes(" ") === false &&
                    document.getElementById("room_name").value.charAt(0) !== "#") {
                    rc+= 1;
                    db.ref("/").update({
                        roomCount: rc
                    })
                    db.ref("rooms/"+document.getElementById("room_name").value+"/roomdetails").update({
                        creator: user,
                        room: document.getElementById("room_name").value,
                        password: document.getElementById("room_password").value,
                    });
                    limit = 0;
                    if(rooms[document.getElementById("room_name").value]["roomdetails"].password === document.getElementById("room_password").value) {
                        localStorage.setItem("roomname",document.getElementById("room_name").value);
                        localStorage.setItem("index",Object.keys(rooms).indexOf(document.getElementById("room_name").value));
                        window.location.replace("./yourroom")
                    } else {
                        alert("Incorrect Password")
                    }
               } else {
                   alert("Please Enter A Valid Syntax For Room Name")
               }
            } else {
                alert("Room Already Exists")
            }
        } else {
            alert("Please Input A Value")
        }
}

setTimeout(() => {
    setInterval(() => {
        if(limit === 1) {
            for(i = 0; i < Object.keys(rooms).length; i++) {
                if(document.getElementById(Object.keys(rooms)[i]) === null) {
                    rows = "<div class='room_name' id="+Object.keys(rooms)[i]+" onclick='redirect(this.id)'  >#"+ Object.keys(rooms)[i] +"</div><br>"
                    document.getElementById("box").innerHTML += "<hr><br>";
                    document.getElementById("box").innerHTML += rows;
                }
            }
        }
        if(localStorage.getItem("user") === null ||
           localStorage.getItem("user") === "") {
             window.location.replace("../")
         }
    }, 1000);
}, 3000);

function logout(){
    localStorage.removeItem("user");
    window.location.replace("../")
}