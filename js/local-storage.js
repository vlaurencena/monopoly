// CLEAR LOCAL STORAGE

document.getElementById("button_clear_local_storage").addEventListener("click", function () {
    localStorage.clear();
    console.log("Local Storage is clear");
});

// UPDATE LOCAL STORAGE 

const update_local_storage = () => {

    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("properties", JSON.stringify(arrayOfProperties));
    localStorage.setItem("currentPlayerId", JSON.stringify(currentPlayerId));

}


// CHECK LOCAL STORAGE

if (localStorage.length === 0) {

    console.log("local storage is empty");
    new_turn();

} else {

    console.log("local storage has something");
    players = JSON.parse(localStorage.getItem("players"));
    properties = JSON.parse(localStorage.getItem("properties"));
    currentPlayerId = JSON.parse(localStorage.getItem("currentPlayerId"));
    currentPlayer = players[currentPlayerId];

}