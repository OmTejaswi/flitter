var user = localStorage.getItem("user");
var greet;
var roomsName = [];
var rc;
var password = [];
var limit = 0;
var roomLimit = 0
var rows;
var db = firebase.database();

    document.getElementById("greet").innerHTML = "Welcome " +user+ " ! <br>";
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
                    rows = "<div class='room_name' id="+roomsName[i]+" onclick='redirect(this.id)'  >#"+ roomsName[i] +"</div><br><hr><br>"
                    document.getElementById("box").innerHTML += rows;
                    roomLimit = 1;
                }
            }
        }
    }
    function redirect(name){
        localStorage.setItem("roomname",name);
        var passcode = prompt("Password:")
        if(roomsName.indexOf(name) === password.indexOf(passcode)) {
            window.location.replace("./yourroom")
        } else {
            alert("Incorrect Password")
        }
        
    }
   

function addroom(){
    if(document.getElementById("room_name").value !== "" &&
        document.getElementById("room_password").value !== "") {
            if(roomsName.includes(document.getElementById("room_name").value) === false) {
                if(document.getElementById("room_name").value.includes(" ") === false) {
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
                        window.location.replace("./yourroom")
                    } else {
                        alert("Incorrect Password")
                    }
               } else {
                   alert("Please Enter A Valid Syntax")
               }
            } else {
                alert("Room Already Exists")
            }
        } else {
            alert("Please Input A Value")
        }
}

function logout(){
    localStorage.removeItem("user");
    window.location.replace("../")
}