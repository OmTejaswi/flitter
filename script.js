//variables
var names = [];
var limit = 0;

function draw(){
    if(limit === 0 ) {
        for(var i = 1; i < pc+1; i++) {
            db.ref("users/user"+i+"/name").on("value",function(data){
                names.push(data.val());
            })
            limit = 1;
        }
    }
}

setInterval(function(){
    if(names.includes(document.getElementById("input").value.toLowerCase()) === true) {
        localStorage.setItem("user",document.getElementById("input").value);
        window.location.replace("./rooms")
    }
},1000);

var username = localStorage.getItem("user");
document.getElementById("input").value = username; 

var db = firebase.database();

var pc;
db.ref("playerCount").on("value",function(data){
    pc = data.val();
})


function btnPressed(){
    var user = document.getElementById("input").value;
    if(user !== "") {
        if(names.includes(document.getElementById("input").value.toLowerCase()) === false &&
           names.includes(document.getElementById("input").value.toUpperCase()) === false) {
                pc += 1;
                db.ref("/").update({
                    playerCount: pc,
                })
                localStorage.setItem("user",user);
                db.ref("users/user"+pc).update({
                    name: user,
                })
                names.push(user);
                window.location.replace("./rooms")
        }
        if(names.includes(document.getElementById("input").value.toLowerCase()) === true ||
        names.includes(document.getElementById("input").value.toUpperCase()) === true) {
            console.error("Name Already Exists")
            window.location.replace("./rooms")
        }
    }
    
}