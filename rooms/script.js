var user = localStorage.getItem("user");
var greet;
var roomsName = [];
var rc;
var password = [];
var limit = 0;
var roomLimit = 0
var rows;
var db = firebase.database();

    document.getElementById("greet").innerHTML = "Welcome " +user+ " !";
    document.getElementById("addroom").innerHTML = "#Add Room";

    var pc;
    db.ref("playerCount").on("value",function(data){
        pc = data.val();
    });
    var rc;
    db.ref("roomCount").on("value",function(data){
        rc = data.val();
    })

    function draw(){
        if(limit === 0) {
            for(var i = 1; i < rc+1; i++) {
                db.ref("rooms/room"+i+"/roomdetails/room").on("value",function(data){
                 roomsName.push(data.val());
                }) 
                db.ref("rooms/room"+i+"/roomdetails/password").on("value",function(data){
                    password.push(data.val());
                   }) 
                limit = 1;
             }
        }
        trends();
    }
    function trends(){
        if(roomsName[0] !== undefined) {
            
            if(roomLimit === 0 && roomsName.length === rc) {
                for(var i = 0; i < roomsName.length; i++) {
                    rows = "<div class='room_name' id="+roomsName[i]+" onclick='redirect(this.id)'  >#"+ roomsName[i] +"</div><br>"
                    document.getElementById("box").innerHTML += rows;
                    if(i !== roomsName.length-1) {
                        document.getElementById("box").innerHTML += "<hr><br>";
                    }
                    if( i === roomsName.length-1) {
                        document.getElementById("box").innerHTML += "<br>";
                    }
                    roomLimit = 1;
                }
            }
        }
    }
    function redirect(name){
        var passcode = prompt("Password:")
            if(passcode !== null) {
                if(roomsName.indexOf(name) === password.indexOf(passcode)) {
                    localStorage.setItem("index",roomsName.indexOf(name)+1)
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
            if(roomsName.includes(document.getElementById("room_name").value.toLowerCase()) === false &&
            roomsName.includes(document.getElementById("room_name").value.toUpperCase()) === false) {
                if(document.getElementById("room_name").value.includes(" ") === false &&
                    document.getElementById("room_name").value.charAt(0) !== "#") {
                    rc+= 1;
                    db.ref("/").update({
                        roomCount: rc
                    })
                    db.ref("rooms/room"+rc+"/roomdetails").update({
                        creator: user,
                        room: document.getElementById("room_name").value,
                        password: document.getElementById("room_password").value,
                    });
                    limit = 0;
                    if(limit === 0) {
                        for(var i = rc; i < rc+1; i++) {
                            db.ref("rooms/room"+i+"/roomdetails/room").on("value",function(data){
                            roomsName.push(data.val());
                            }) 
                            db.ref("rooms/room"+i+"/roomdetails/password").on("value",function(data){
                                password.push(data.val());
                            }) 
                            limit = 1;
                        }
                    }
                    localStorage.setItem("roomname",document.getElementById("room_name").value);
                    if(roomsName.indexOf(document.getElementById("room_name").value) === password.indexOf(document.getElementById("room_password").value)) {
                        localStorage.setItem("index",roomsName.indexOf(document.getElementById("room_name").value)+1)
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

setInterval(() => {
    setInterval(() => {
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