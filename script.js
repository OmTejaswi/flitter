//variables
var names = [];
var nameslowercase = [];
var limit = 0;
var password = [];
var passcode;

function draw(){
    if(limit === 0 ) {
        for(var i = 1; i < pc+1; i++) {
            db.ref("users/user"+i+"/name").on("value",function(data){
                names.push(data.val());
                nameslowercase.push(data.val().toLowerCase());
            })
            db.ref("users/user"+i+"/password").on("value",function(data){
                password.push(data.val());
            })
            limit = 1;
        }
    }
}


var username = localStorage.getItem("user");
document.getElementById("input").value = username; 

var db = firebase.database();

var pc;
db.ref("playerCount").on("value",function(data){
    pc = data.val();
})


function btnPressed(){
    
    
        if(nameslowercase.includes(document.getElementById("input").value.toLowerCase()) === true) {
            passcode = prompt("Password:");
            if(passcode !== null) {
                if(nameslowercase.indexOf(document.getElementById("input").value.toLowerCase()) === password.indexOf(passcode)) {
                    localStorage.setItem("user",document.getElementById("input").value);
                    window.location.replace("./rooms")
                }else {
                    alert("Incorrect Password");
                }
            }
            
        } else if(nameslowercase.includes(document.getElementById("input").value.toLowerCase()) === false) {
                    alert("User Name Does Not Exist");
                 }
}
function signup(){
    var user = document.getElementById("input").value;
    if(user !== "") {
        if(nameslowercase.includes(document.getElementById("input").value.toLowerCase()) === false) {
                passcode = prompt("Set Your Password:");
                if(passcode !== null) {
                    pc += 1;
                    db.ref("/").update({
                        playerCount: pc,
                    })
                    localStorage.setItem("user",user);
                    db.ref("users/user"+pc).update({
                        name: user,
                        password: passcode
                    })
                    names.push(user);
                    window.location.replace("./rooms")
                }
        }
    }
    if(nameslowercase.includes(document.getElementById("input").value.toLowerCase()) === true) {
        alert("Name Already Exists")
    }  
}