/*---------------------- INITIAL SETUP ----------------------*/

const initialMoney = 1500;
const tokenColors = ["red", "blue", "skin", "orange"];

/*---------------------- PLAYER'S SETUP ----------------------*/

const realVersion = true;

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
                        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
                        let randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                        console.log(randomLetter);
                        let URL = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${randomLetter}&ts=1&apikey=${publicKey}&hash=${hash}`;
                        $.get(URL, function (respuesta, estado) {
                            if (estado === "success") {
                                console.log(respuesta);
                                let randomIndex = Math.floor(Math.random() * respuesta.data.results.length);
                                console.log(randomIndex);
                                $(`#player_name_${playerID}`).val(respuesta.data.results[randomIndex].name);
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
                <input type="text" id="player_name_${i}" name="player-${i}" required>
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
                players.push(new Player(i, playerName, tokenColors[i], 0, initialMoney, [], 0, false, false, false));
                allPlayersIds.push(i);

                if (i % 2 !== 0) {

                    document.querySelector("#player-container-2").innerHTML =
                        document.querySelector("#player-container-2").innerHTML +=
                        `<div id="player-${i}">
            <div id="player_name_${i}" class="player-name">${playerName}</div>
            <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
            <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${false}</div>
            <div class="player-list-of-properties">List of properties</div>
            <ul id=player_properties_${i}>
            </ul>
            </div>`

                } else {
                    document.querySelector("#player-container-1").innerHTML =
                        document.querySelector("#player-container-1").innerHTML +=
                        `<div id="player-${i}">
            <div id="player_name_${i}" class="player-name">${playerName}</div>
            <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
            <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${false}</div>
            <div class="player-list-of-properties">List of properties</div>
            <ul id=player_properties_${i}>
            </ul>
            </div>`;
                }

                /*------ PLAYERS TOKENS ------*/
                let token = document.createElement("span");
                token.id = "token-player-" + i;
                token.classList.add("token", "token-color-player-" + tokenColors[i])
                document.getElementById("token-holder-0").append(token);

            }
            $("#form_player_setup").hide();
            start_new_game();
            new_turn();
            update_local_storage();
        });


    } else {

        // FAST VERSION FOR DEVELOPMENT

        console.log("real version OFF");


        for (i = 0; i < 4; i++) {

            players.push(new Player(i, `Player ${tokenColors[i]}`, tokenColors[i], 0, initialMoney, [], 0, false, false, false));
            allPlayersIds.push(i);

            /*------ PLAYERS CONTAINER ------*/

            if (i % 2 !== 0) {

                document.querySelector("#player-container-2").innerHTML =
                    document.querySelector("#player-container-2").innerHTML +=
                    `<div id="player-${i}">
                                <div id="player_name_${i}" class="player-name">Player ${tokenColors[i]}</div>
                                <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
                                <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${false}</div>
                                <div class="player-list-of-properties">List of properties</div>
                                <ul id=player_properties_${i}>
                                </ul>
                             </div>`

            } else {
                document.querySelector("#player-container-1").innerHTML =
                    document.querySelector("#player-container-1").innerHTML +=
                    `<div id="player-${i}">
                                    <div id="player_name_${i}" class="player-name">Player ${tokenColors[i]}</div>
                                    <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
                                    <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${false}</div>
                                    <div class="player-list-of-properties">List of properties</div>
                                    <ul id=player_properties_${i}>
                                    </ul>
                                </div>`;
            }

            /*------ PLAYERS TOKENS ------*/
            let token = document.createElement("span");
            token.id = "token-player-" + i;
            token.classList.add("token", "token-color-player-" + tokenColors[i])
            document.getElementById("token-holder-0").append(token);
        }

        $("#form_player_setup").hide();
        start_new_game();
        new_turn();

    }

}
// Your public key
// 2cbc1527cffc69d668e63c9a86cfc013
// Your private key
// b79b9a1797c8ffb07da1c149ea4463077b610281