var user = localStorage.getItem("user");
var greet;
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

function addroom(){
    if(document.getElementById("room_name") !== "" &&
        document.getElementById("room_password") !== "") {
            db.ref("rooms/"+document.getElementById("room_name").value).update({
                room: "#"+document.getElementById("room_name").value,
                password: document.getElementById("room_password").value,
            })
        }
}

function logout(){
    localStorage.removeItem("user");
    window.location.replace("../")
}