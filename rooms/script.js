var user = localStorage.getItem("user");
var greet

function setup() {
    //greet = createElement("h2").html("Welcome " +user+ " !");
    document.getElementById("greet").innerHTML = "Welcome " +user+ " !";
}