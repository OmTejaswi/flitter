var username = localStorage.getItem("user");
document.getElementById("input").value = username; 

var db = firebase.database();

var pc;
db.ref("playerCount").on("value",function(data){
    pc = data.val();
})





//variables
var names = [];
var limit = 0;

function setup(){
    
}
function draw(){
    if(limit === 0 ) {
        for(var i = 1; i < pc+1; i++) {
            db.ref("users/user"+i+"/name").on("value",function(data){
                names.push(data.val());
            })
            limit = 1;
        }
    }
    if(names.includes(document.getElementById("input").value.toLowerCase()) === true) {
        window.location.replace("./rooms")
    }
}

function btnPressed(){
    var user = document.getElementById("input").value;
    if(names[0] === undefined) {
        pc += 1;
        localStorage.setItem("user",user);

        db.ref("users/user"+pc).update({
            name: user,
        })
        db.ref("/").update({
            playerCount: pc,
        })
        window.location.replace("./rooms")
}
    if(names.includes(document.getElementById("input").value.toLowerCase()) === false) {
            pc += 1;
            localStorage.setItem("user",user);
    
            db.ref("users/user"+pc).update({
                name: user,
            })
            db.ref("/").update({
                playerCount: pc,
            })
            names.push(user)
            window.location.replace("./rooms")
    }
    if(names.includes(document.getElementById("input").value.toLowerCase()) === true) {
        console.error("Name Already Exists")
    }
    
}