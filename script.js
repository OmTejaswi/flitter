var username = localStorage.getItem("user");
document.getElementById("input").value = username; 

var db = firebase.database();

var pc;
db.ref("playerCount").on("value",function(data){
    pc = data.val();
})

function btnPressed(){
    pc += 1;
    
    var user = document.getElementById("input").value;
    localStorage.setItem("user",user);

    db.ref("users/user"+pc).update({
        user: username,
    })
    db.ref("/").update({
        playerCount: pc,
    })
}