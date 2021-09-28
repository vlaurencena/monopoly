/*---------------------- INITIAL SETUP ----------------------*/

const initialMoney = 1500;
const tokenColors = ["red", "blue", "skin", "orange"];

/*---------------------- PLAYER'S SETUP ----------------------*/

const realVersion = false;

if (localStorage.length === 0) {

    if (realVersion) {

        // REAL VERSION

        console.log("real version ON");

        let radios = document.forms["form-number-players"].elements["number-of-players"];

        //TODO NOW IT GEST A RANDOM NAME FROM THE 20 FIRST THAT ARE SENT, NEED TO GET REAL RANDOM NAME BY USING OFFSET

        for (radio in radios) {
            radios[radio].onclick = function () {
                console.log(this.value);
                $("#form_player_info").show();
                $("#form_player_info").html(``);
                createPlayerForm(this.value);

                // GET SUPERHERO NAMES
                $(".get-superhero-name").click(function (event) {
                    let playerID = event.target.id.split('-')[1];
                    const getName = () => {
                        const publicKey = "2cbc1527cffc69d668e63c9a86cfc013";
                        const hash = "9fec144e8c5f068531d1ce7c701987f5";
                        const alphabet = "abcdefghijklmnopqrstuvwxyz";
                        let randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
                        console.log(randomCharacter);
                        let URL = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${randomCharacter}&ts=1&apikey=${publicKey}&hash=${hash}`;
                        $.get(URL, function (respuesta, estado) {
                            if (estado === "success") {
                                console.log(respuesta);
                                let randomIndex = Math.floor(Math.random() * respuesta.data.results.length);
                                console.log(randomIndex);
                                $(`#name_${playerID}`).val(respuesta.data.results[randomIndex].name);
                                $(`#superhero-${playerID}`).val("I want another Marvel superhero name!");
                            }
                        });

                    }
                    getName();
                });
            }
        }

        const createPlayerForm = (number) => {
            for (let i = 0; i < number; i++) {
                $("#form_player_info").append(`
                <label for="player_${i}">Player ${i + 1} Name:</label>
                <input type="text" id="name_${i}" name="player-${i}" required>
                <input class="get-superhero-name" type="button" id="superhero-${i}" value="I want a Marvel superhero name!"><br>
                `);
            }
            $("#form_player_info").append(`
            <button type="submit">SUBMIT</button>
                `);
        }


        document.getElementById("form_player_info").addEventListener("submit", function (e) {
            let arrayOfNames = $(this).serializeArray()
            console.log(arrayOfNames);
            e.preventDefault();

            for (i = 0; i < arrayOfNames.length; i++) {
                let playerName = arrayOfNames[i].value;
                players.push(new Player(i, true, playerName, tokenColors[i], 0, initialMoney, 0, false, false, false));
                allPlayersIds.push(i);

                /*------ PLAYERS TOKENS ------*/
                let token = document.createElement("span");
                token.id = "token-player-" + i;
                token.classList.add("token", "token-color-player-" + tokenColors[i])
                document.getElementById("token-holder-0").append(token);

            }

            $("#form_player_setup").hide();
            startNewGame();
            newTurn();
            // update_local_storage();
        });


    } else {

        // FAST VERSION FOR DEVELOPMENT

        console.log("real version OFF");

        for (i = 0; i < 4; i++) {

            players.push(new Player(i, true, `Player ${i}`, tokenColors[i], 0, initialMoney, 0, false, false, false));
            allPlayersIds.push(i);
            /*------ PLAYERS TOKENS ------*/
            let token = document.createElement("span");
            token.id = "token-player-" + i;
            token.classList.add("token", "token-color-player-" + tokenColors[i])
            document.getElementById("token-holder-0").append(token);
        }


        $("#form_player_setup").hide();
        startNewGame();
        newTurn();
    }
}

const createPlayersContainers = () => {
    players.forEach(function (player) {
        let playerContantainer =
            `<div id="player-${player.id}">
            <div id="player_name_${player.id}" class="player-name">${player.name}</div>
            <div id="player_wallet_${player.id}" class="player-wallet">$${player.wallet}</div>
            <div id="player_jail_card_${player.id}" class="player-jail-card">Free Jail Card? ${player.jailCard}</div>
            <div class="player-list-of-properties">List of properties</div>
            <ul id=player_properties_${player.id}>
            </ul>
         </div>`;

        if (player.stillPlaying === true && player.id % 2 !== 0) {
            document.querySelector("#player-container-2").innerHTML =
                document.querySelector("#player-container-2").innerHTML +=
                playerContantainer;

        } else if (player.stillPlaying === true && player.id % 2 === 0) {
            document.querySelector("#player-container-1").innerHTML =
                document.querySelector("#player-container-1").innerHTML +=
                playerContantainer;
        } else if (player.stillPlaying === false) {
            console.log(`${player.name} is no longer playing.`);
        } else {
            console.error("Something went wrong")
        }

        $(`#player-${player.id}`).append(`<button id="quit_player_${player.id}" class="player-quit-game">Quit game</button>`)
    });

    $(`#player_name_${currentPlayer.id}`).addClass(`player-${currentPlayer.color}-turn`);

    // BUTTON QUIT GAME
    $(".player-quit-game").click(function (event) {
        let quitPlayerId = parseInt(event.target.id.slice(12, 13));
        players[quitPlayerId].quitGame();
        if (currentPlayer.id === quitPlayerId) {
            currentPlayer.endTurn();
            newTurn();
        }
        console.log(`quit player id: ${quitPlayerId}`);
        $(`#player-${quitPlayerId}`).remove();
        updateAllBoard();
    });
}

createPlayersContainers();
// QUIT GAME

