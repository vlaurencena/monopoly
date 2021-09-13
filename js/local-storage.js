/*------ CLEAR LOCAL STORAGE ------*/
document.getElementById("button_clear_local_storage").addEventListener("click", function () {
    localStorage.clear();
    console.log("Local Storage is clear");
});

/*------ UPDATE LOCAL STORAGE ------*/
const update_local_storage = () => {
    localStorage.setItem("currentPlayerId", JSON.stringify(currentPlayerId));
    localStorage.setItem("currentSquare", JSON.stringify(currentSquare));
    localStorage.setItem("diceResult", JSON.stringify(diceResult));
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("squares", JSON.stringify(squares));
    localStorage.setItem("consoleMessages", JSON.stringify(consoleMessages));
    localStorage.setItem("allPlayersIds", JSON.stringify(allPlayersIds));
    localStorage.setItem("currentTurnStatus", JSON.stringify(currentTurnStatus));
    console.log("Local Storage was updated");
}

 // RETRIEVE LOCAL STORAGE
 const retrieve_local_storage = () => {
    // PLAYERS ARRAY
    players = [];
    let string_of_players = JSON.parse(localStorage.getItem("players"));
    string_of_players.forEach(player => {
        players.push(new Player(player.id, player.name, player.color, player.position, player.wallet, player.propertiesOwn, player.throwDoubles, player.anotherTurn, player.inJail, player.jailCard));
    });
    //  SQUARES ARRAYS
    squares = JSON.parse(localStorage.getItem("squares"));
    // INITIAL GAMEPLAY
    currentPlayerId = JSON.parse(localStorage.getItem("currentPlayerId"));
    currentPlayer = players[currentPlayerId];
    currentSquare = JSON.parse(localStorage.getItem("currentSquare"));
    diceResult = JSON.parse(localStorage.getItem("diceResult"));
    currentTurnStatus = JSON.parse(localStorage.getItem("currentTurnStatus"));
    allPlayersIds = JSON.parse(localStorage.getItem("allPlayersIds"));
}

/*------ CHECK LOCAL STORAGE ------*/
if (localStorage.length === 0) {
    // IS EMPTY
    console.log("local storage is empty");

} else {
    // IS NOT EMPTY
    console.log("local storage has something");
    $("#form_player_setup").hide();
    retrieve_local_storage();

    // CREATE PLAYER CONTAINER
    for (i = 0; i < players.length; i++) {

        if (i % 2 !== 0) {
            document.querySelector("#player-container-2").innerHTML =
                document.querySelector("#player-container-2").innerHTML +=
                `<div id="player-${i}">
                    <div id="player_name_${i}" class="player-name">${players[i].name}</div>
                    <div id="player_wallet_${i}" class="player-wallet">$${players[i].initialMoney}</div>
                    <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${players[i].jailCard}</div>
                    <div class="player-list-of-properties">List of properties</div>
                    <ul id=player_properties_${i}>
                    </ul>
                    </div>`
        } else {
            document.querySelector("#player-container-1").innerHTML =
                document.querySelector("#player-container-1").innerHTML +=
                `<div id="player-${i}">
                <div id="player_name_${i}" class="player-name">${players[i].name}</div>
                <div id="player_wallet_${i}" class="player-wallet">$${players[i].initialMoney}</div>
                <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${players[i].jailCard}</div>
                <div class="player-list-of-properties">List of properties</div>
                <ul id=player_properties_${i}>
                </ul>
                </div>`;
        }

        // CREATE PLAYERS TOKENS
        let token = document.createElement("span");
        token.id = "token-player-" + i;
        token.classList.add("token", "token-color-player-" + tokenColors[i])
        document.getElementById("token-holder-0").append(token);

    }
    /*------ UPDATE BOARD ------*/

    // PROPERTIES
    squares.forEach(property => {
        if (property.owner !== undefined) {
            message(players[property.owner].color);
            document.querySelector(`#square-${property.id}`).classList.add(`property-of-player-${players[property.owner].color}`);
        };
    });

    // CONSOLE
    let consoleRecoveredMessages = JSON.parse(localStorage.getItem("consoleMessages"));
    consoleRecoveredMessages.forEach(text => {
        message(text);
    });

    // TOKEN'S POSITIONS
    players.forEach(player => {
        player.jump(player.position);
    });

    $("#form_player_setup").hide();
    update_players_containers(); // MAIN

    /*------ CONTINUE CURRENT GAMEPLAY ------*/

    if (currentTurnStatus.playerHasRolled === true) {
        document.getElementById(`dice_1`).src = `media/dice-${diceResult[0]}.svg`;
        document.getElementById(`dice_2`).src = `media/dice-${diceResult[1]}.svg`;
    }

    // TODO -> UPDATE EXTRA TURN
    
    if (currentTurnStatus.playerHasRolled === false) {
        currentSquare = squares[currentPlayer.position]; // SOLVED CURRENTSQUARE MYSTERY
        new_turn();
    } else if (currentTurnStatus.playerHasRolled === true && currentTurnStatus.playerHasMoved === false) {
        currentSquare = squares[currentPlayer.position]; // SOLVED CURRENTSQUARE MYSTERY
        player_rolled_dices();

    } else if (currentTurnStatus.playerHasMoved === true && currentTurnStatus.playerHasFinished === false) {
        currentSquare = squares[currentPlayer.position]; // SOLVED CURRENTSQUARE MYSTERY
        player_moved();
    } else if (currentTurnStatus.playerHasFinished === true) {
        currentSquare = squares[currentPlayer.position]; // SOLVED CURRENTSQUARE MYSTERY
        player_completed_turn()
    } else {
        console.error("Shit, we don't know what happen");
    }
};

// TODO -> CURRENT CHEST/CHANCE CARD IS NOT SAVED
// TODO -> DOESN't RETRIEVE CURRENT SQUARE