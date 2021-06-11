//variables
var limit = 0;
var passcode;
var use;
var users;

function loaded() {
    setInterval(function(){
        if(limit === 1) {
            document.getElementById("loading").style.display = 'none';
            document.getElementById("dis").style.display = '';
        }
    },1000)
}

var username = localStorage.getItem("user");
document.getElementById("input").value = username; 

var db = firebase.database();

var pc;
db.ref("playerCount").on("value",function(data){
    pc = data.val();
})
db.ref("users").on("value",function(data){
     use = data.val();
     users = JSON.parse(JSON.stringify(use));
     limit = 1;
});

function btnPressed(){
    
    
        if(users.hasOwnProperty(document.getElementById("input").value) === true) {
            passcode = prompt("Password:");
            if(passcode !== null) {
                if(users[document.getElementById("input").value].password.toString() === passcode) {
                    localStorage.setItem("user",document.getElementById("input").value);
                    window.location.replace("./rooms")
                }else {
                    alert("Incorrect Password");
                }
            }
            
        } else if(users.hasOwnProperty(document.getElementById("input").value) === false) {
                    alert("User Name Does Not Exist");
                 }
}
function signup(){
    var user = document.getElementById("input").value;
    if(user !== "" && user !== "YOU".toLowerCase() && user !== "YOU") {
        if(users.hasOwnProperty(document.getElementById("input").value) === false &&
        users.hasOwnProperty(document.getElementById("input").value.toLowerCase) === false &&
        users.hasOwnProperty(document.getElementById("input").value.toUpperCase) === false) {
                passcode = prompt("Set Your Password:");
                if(passcode !== null) {
                    pc += 1;
                    db.ref("/").update({
                        playerCount: pc,
                    })
                    localStorage.setItem("user",user);
                    db.ref("users/"+user).update({
                        name: user,
                        password: passcode
                    })
                    window.location.replace("./rooms")
                }
        }
    }
    if(users.hasOwnProperty(document.getElementById("input").value) === true ||
    users.hasOwnProperty(document.getElementById("input").value.toLowerCase) === true ||
    users.hasOwnProperty(document.getElementById("input").value.toUpperCase) === true) {
        alert("Name Already Exists")
    }  
}