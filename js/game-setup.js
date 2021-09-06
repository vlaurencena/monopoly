/*---------------------- INITIAL SETUP ----------------------*/

const initialMoney = 1500;
const tokenColors = ["red", "blue", "skin", "orange"];

/*---------------------- PLAYER'S SETUP ----------------------*/

const players = [];
const allPlayersIds = [];

// REAL VERSION

let numberOfPlayer = parseInt(prompt(`Choose number of players from 2-4?`));

for (i = 0; i < numberOfPlayer; i++) {
    let playerName = prompt(`Whats the name of player ${i+1}`);
    players.push(new Player(i, playerName, tokenColors[i], 0, initialMoney, [], 0, false, false, false));

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
                        <div id="player_properties_${i}" class="player-list-of-properties">List of properties</div>
                        <ul>
                        </ul>
                    </div>`;
    }

    /*------ PLAYERS TOKENS ------*/
    let token = document.createElement("span");
    token.id = "token-player-" + i;
    token.classList.add("token", "token-color-player-" + tokenColors[i])
    document.getElementById("token-holder-0").append(token);

}

// FAST VERSION FOR DEVELOPMENT


// for (i = 0; i < 4; i++) {

//     players.push(new Player(i, `Player ${tokenColors[i]}`, tokenColors[i], 0, initialMoney, [], 0, false, false, false));
//     allPlayersIds.push(i);

//     /*------ PLAYERS CONTAINER ------*/

//     if (i % 2 !== 0) {

//         document.querySelector("#player-container-2").innerHTML =
//             document.querySelector("#player-container-2").innerHTML +=
//             `<div id="player-${i}">
//                 <div id="player_name_${i}" class="player-name">Player${i}</div>
//                 <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
//                 <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${false}</div>
//                 <div class="player-list-of-properties">List of properties</div>
//                 <ul id=player_properties_${i}>
//                 </ul>
//              </div>`

//     } else {
//         document.querySelector("#player-container-1").innerHTML =
//             document.querySelector("#player-container-1").innerHTML +=
//             `<div id="player-${i}">
//                 <div id="player_name_${i}" class="player-name">Player${i}</div>
//                 <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
//                 <div id="player_jail_card_${i}" class="player-jail-card">Free Jail Card? ${false}</div>
//                 <div id="player_properties_${i}" class="player-list-of-properties">List of properties</div>
//                 <ul>
//                 </ul>
//             </div>`;
//     }

//     /*------ PLAYERS TOKENS ------*/
//     let token = document.createElement("span");
//     token.id = "token-player-" + i;
//     token.classList.add("token", "token-color-player-" + tokenColors[i])
//     document.getElementById("token-holder-0").append(token);
// }