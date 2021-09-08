// CLEAR LOCAL STORAGE

document.getElementById("button_clear_local_storage").addEventListener("click", function () {
    localStorage.clear();
    console.log("Local Storage is clear");
});

// UPDATE LOCAL STORAGE 

const update_local_storage = () => {

    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("squares", JSON.stringify(squares));
    localStorage.setItem("currentPlayerId", JSON.stringify(currentPlayerId));
    console.log("Local Storage was updated");
}

// CHECK LOCAL STORAGE

if (localStorage.length === 0) {

    console.log("local storage is empty");
    new_turn();

} else {

    console.log("local storage has something");

      // UPDATE PLAYERS INFO

      players = [];

      var string_of_players = JSON.parse(localStorage.getItem("players"));
  
      string_of_players.forEach(player => {
          players.push(new Player(player.id, player.name, player.color, player.position, player.wallet, player.propertiesOwn, player.throwDoubles, player.anotherTurn, player.inJail, player.jailCard));
      });
  
      update_players_containers(); // MAIN

    // UPDATE CURRENT PLAYERS

    currentPlayerId = JSON.parse(localStorage.getItem("currentPlayerId"));

    currentPlayer = players[currentPlayerId];  

    // UPDATE PROPERTIES ARRAYS

    squares = JSON.parse(localStorage.getItem("squares"));  

    // UPDATE BOARD -> PROPERTIES

    squares.forEach(property => {

        if(property.owner !== undefined) {
            message(players[property.owner].color);
            document.querySelector(`#square-${property.id}`).classList.add(`property-of-player-${players[property.owner].color}`);
        }
        ;
    });
    
    // UPDATE BOARD -> TOKENS

    players.forEach(player => {
        player.jump(player.position);
    });


    new_turn();

}

