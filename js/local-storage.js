/*------ RESTART GAME ------*/
document.getElementById("button_restart_game").addEventListener("click", function () {
    localStorage.clear();
    location.reload();
    console.log("Local Storage is clear.");
});

$("#control_buttons").click(function () {
    updateLocalStorage();
})

/*------ CHECK LOCAL STORAGE ------*/
if (localStorage.length !== 0) {
    console.log("Local Storage has something.");
    $("#form_game_setup").hide();
    retrieveLocalStorage();
    createPlayersContainers();
    createTokens();
    for (let player of players) {
        updateTokens(player);
    }
    let consoleMessages = JSON.parse(localStorage.getItem("consoleMessages"));
    consoleMessages.forEach(text => {
        message(text);
    });
    updateAllBoard();
    if (currentPlayer.anotherTurn) {
        $("#button_end_turn").html("Play again");
    }
    continueTurn();
} else {
    console.log("Local Storage is empty.");
}