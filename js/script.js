/*---------------------- LIST OF ELEMENTS ----------------------*/

const consoleDisplay = document.getElementById("console-display");


/*---------------------- INITIAL SETUP ----------------------*/

const initialMoney = 1500;
const tokenColors = ["red", "blue", "skin", "orange"];

/*---------------------- PLAYER'S SETUP ----------------------*/

const players = [];
const allPlayersIds = [];

// REAL VERSION

// let numberOfPlayer = parseInt(prompt(`Choose number of players from 2-4?`));

// for (i = 0; i < numberOfPlayer; i++) {
//     let playerName = prompt(`Whats the name of player ${i+1}`);
//     players.push(new Player(i, playerName, tokenColors[i], 0, undefined, initialMoney, false, 0, false));

//     if (i % 2 !== 0) {

//         document.querySelector("#player-container-1").innerHTML =
//             document.querySelector("#player-container-1").innerHTML +=
//             `<div>
// <div class="player-name">${playerName}</div>
// <div class="player-wallet">$${initialMoney}</div>
// <div class="player-list-of-properties">List of properties</div>
// <ul>
// </ul>
//         </div>`;
//     } else {
//         document.querySelector("#player-container-2").innerHTML =
//             document.querySelector("#player-container-2").innerHTML +=
//             `<div>
// <div class="player-name">${playerName}</div>
// <div class="player-wallet">$${initialMoney}</div>
// <div class="player-list-of-properties">List of properties</div>
// <ul>
// </ul>
//         </div>`
//     }

// }

// FAST VERSION FOR DEVELOPMENT

// (id, name, tokenColor, position, wallet, propertiesOwn, throwDoubles, anotherTurn, isInJail, jailCard)

for (i = 0; i < 4; i++) {

    players.push(new Player(i, `Player${i}`, tokenColors[i], 0, initialMoney, [], 0, false, false, false));
    allPlayersIds.push(i);

    /*------ PLAYERS CONTAINER ------*/

    if (i % 2 !== 0) {

        document.querySelector("#player-container-2").innerHTML =
            document.querySelector("#player-container-2").innerHTML +=
            `<div>
                <div class="player-name">Player${i}</div>
                <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
                <div class="player-list-of-properties">List of properties</div>
                <ul id=player_properties_${i}>
                </ul>
             </div>`

    } else {
        document.querySelector("#player-container-1").innerHTML =
            document.querySelector("#player-container-1").innerHTML +=
            `<div>
                <div class="player-name">Player${i}</div>
                <div id="player_wallet_${i}" class="player-wallet">$${initialMoney}</div>
                <div id="player_wallet_${i}" class="player-wallet">Free Jail Card? ${false}</div>
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

/*---------------------- INITIAL GAMEPLAY SETUP ----------------------*/

let currentPlayerId = 0; // NEEDS CONSTANT UPDATE
let currentPlayer = players[currentPlayerId]; // NEEDS CONSTANT UPDATE
let currentSquare = squares[currentPlayer.position]; // NEEDS CONSTANT UPDATE
let diceResult;

/*------ CONTROL PANNEL BUTTONS ------*/

const button_roll_dice = document.getElementById("button_roll_dice");
const button_move = document.getElementById("button_move");
const button_buy = document.getElementById("button_buy");
const button_end_turn = document.getElementById("button_end_turn");
const button_pay = document.getElementById("button_pay");
const button_use_jail_card = document.getElementById("button_use_jail_card");

hide_element = (element) => {
    element.style.display = "none";
}

show_element = (element) => {
    element.style.display = "block";
}

/*---------------------- GAME PLAY ----------------------*/

/*------ STEP 1 ------*/

newTurn = () => {

    currentPlayer = players[currentPlayerId];
    currentSquare = squares[currentPlayer.position];
    diceResult = undefined;

    console.log(`Now it's ${currentPlayer.name}'s turn.`);

    /*- HIDE ALL BUTTONS -*/
    hide_element(button_roll_dice);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay);
    hide_element(button_use_jail_card);
    /*--------------------*/

    if (currentPlayer.isInJail === true) { // IS IN JAIL?

        show_element(button_pay);
        button_pay.addEventListener("click", function () {
            currentPlayer.jailCard = false;
            currentPlayer.isInJail = false;
            console.log(`${currentPlayer.name} payed $50 and is now free`);
            currentPlayer.transaction(-50);
            newTurn();

        }, {
            once: true
        });

        show_element(button_roll_dice);
        button_roll_dice.addEventListener("click", function () {
            currentPlayer.rollDices;
            if (currentPlayer.throwDoubles === 0) {
                console.log(`${currentPlayer.name} didn't rolled doubles, still in Jail`);
                currentPlayer.endTurn();
            } else if (currentPlayer.throwDoubles === 1) {
                console.log(`${currentPlayer.name} rolled doubles! Is free to go!`);
                currentPlayer.throwDoubles = 0;
                newTurn();
            } else {
                console.err(`${currentPlayer.name} throwDoubles is not 0 || 1`);
            }
        }, {
            once: true
        });

        if (currentPlayer.jailCard === true) { // HAS FREE JAIL CARD 

            console.log(`${currentPlayer.name} is in jail and YES Jail Card. To get out of jail, you can pay $50, use your card or try to roll doubles.`);

            show_element(button_use_jail_card);
            button_use_jail_card.addEventListener("click", function () {
                currentPlayer.jailCard = false;
                currentPlayer.isInJail = false;
                console.log(`${currentPlayer.name} used his Jail Card and is now free`);
                newTurn();
            }, {
                once: true
            });



        } else if (currentPlayer.jailCard === false) { // DON'T HAVE FREE JAIL CARD
            console.log(`${currentPlayer.name} is in jail and you NO Jail Card. To get out of jail, you can pay $50, or try to roll doubles.`);
        }

    } else { // IS NOT IN JAIL

        if (currentPlayer.position === 20) { // IS IN FREE PARKING

            // TO DO

        } else { // IS NOT IN JAIL NOR FREE PARKING; NEEDS TO ROLL

            show_element(button_roll_dice);
            button_roll_dice.addEventListener("click", function () {
                diceResult = currentPlayer.rollDices();
                player_rolled_dices();
            }, {
                once: true
            });
        }
    }
}

/*------ STEP 2 ------*/

player_rolled_dices = () => {

    /*- HIDE ALL BUTTONS -*/
    hide_element(button_roll_dice);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay);
    hide_element(button_use_jail_card);
    /*--------------------*/

    show_element(button_move);
    button_move.addEventListener("click", function () {
        currentPlayer.move(diceResult);
        diceResult = undefined;
        currentSquare = squares[currentPlayer.position];
        player_moved();
    }, {
        once: true
    });

}

/*------ STEP 3 ------*/
player_moved = () => {

    /*- HIDE ALL BUTTONS -*/
    hide_element(button_roll_dice);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay);
    hide_element(button_use_jail_card);
    /*--------------------*/

    if (currentSquare.price !== 0 && currentSquare.owner === undefined) { // IS ON PROPERTY WITH NO OWNER

        console.log(`currentplayer is on property with no owner`);
        show_element(button_buy);
        button_buy.addEventListener("click", function () {
            currentPlayer.buy(currentSquare);
            hide_element(button_buy);
        }, {
            once: true
        });

        show_element(button_end_turn);
        button_end_turn.addEventListener("click", function () {
            player_completed_turn();
        }, {
            once: true
        });

    } else if (currentSquare.price !== 0 && currentSquare.owner === currentPlayerId) { // IS ON PROPERTY OF OWN

        show_element(button_end_turn);
        button_end_turn.addEventListener("click", function () {
            player_completed_turn();
        }, {
            once: true
        });

    } else if (currentSquare.price !== 0 && currentSquare.owner !== currentPlayerId) { // IS ON PROPERTY OF OTHER PLAYER

        // TODO

    } else if (currentSquare.id === 10) { // JUST VISITIN NOTHING HAPPENS

        show_element(button_end_turn);
        button_end_turn.addEventListener("click", function () {
            player_completed_turn();
        }, {
            once: true
        });
    } else if (currentSquare.id === 2 || currentSquare.id === 17 || currentSquare.id === 33) { // IS ON COMMUNITY CHEST

        // TODO

    } else if (currentSquare.id === 7 || currentSquare.id === 22 || currentSquare.id === 36) { // IS ON CHANCE

        // TODO

    }
}

/*------ STEP 4 ------*/
player_completed_turn = () => {

    /*- HIDE ALL BUTTONS -*/
    hide_element(button_roll_dice);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay);
    hide_element(button_use_jail_card);
    /*--------------------*/

    currentPlayer.endTurn();
    newTurn();

}

newTurn();