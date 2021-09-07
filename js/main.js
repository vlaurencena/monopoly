/*---------------------- BOARD CONFIGURACION ----------------------*/


// const add_event_to_property = () => {

//     for (var i = 0; i < arrayOfProperties.length; i++) {

//         document.getElementById(`property_${i}`).addEventListener("click", function () {
//             console.log("sip");
//         })
//     }
// }


/*------ CONTROL PANNEL BUTTONS ------*/

// GENERAL USAGE
const all_buttons = document.getElementById("control_buttons");
all_buttons.addEventListener("click", function () {
    update_local_storage();
    update_players_containers();
});

const button_roll_dice = document.getElementById("button_roll_dice");
button_roll_dice.addEventListener("click", function () {
    diceResult = currentPlayer.rollDices();
    console.log(diceResult);
    player_rolled_dices();
});

const button_move = document.getElementById("button_move");
button_move.addEventListener("click", function () {
    currentPlayer.move(diceResult[2]);
    diceResult = [];
    player_moved();
});

const button_end_turn = document.getElementById("button_end_turn");
button_end_turn.addEventListener("click", function () {
    currentPlayer.endTurn();
    new_turn();
});

// FOR JAIL
const button_use_jail_card = document.getElementById("button_use_jail_card");
button_use_jail_card.addEventListener("click", function () {
    currentPlayer.getOutOfJail();
    console.log(`You used your jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
    player_completed_turn();
});

const button_roll_dice_in_jail = document.getElementById("button_roll_dice_in_jail");
button_roll_dice_in_jail.addEventListener("click", function () {
    currentPlayer.rollDices();
    player_completed_turn();
    /*------ ROLLED DOUBLES? ------*/
    if (currentPlayer.throwDoubles) {
        /*--- YES ---*/
        console.log(`You throw doubles. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
        currentPlayer.getOutOfJail();
    } else {
        /*--- NO ---*/
        console.log(`No doubles, you lost turn. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
    }
});

const button_pay_50 = document.getElementById("button_pay_50");
button_pay_50.addEventListener("click", function () {
    currentPlayer.transaction(-50);
    player_completed_turn();
});

// FOR TAX INCOME
const button_pay_200 = document.getElementById("button_pay_200");
button_pay_200.addEventListener("click", function () {
    currentPlayer.transaction(-200);
    player_completed_turn();
});

// FOR PROPERTIES
const button_buy = document.getElementById("button_buy");
button_buy.addEventListener("click", function () {
    currentPlayer.buy(currentSquare);
    player_completed_turn();
});

// FOR CARDS
const button_pick_up_chest_card = document.getElementById("button_pick_up_chest_card");
button_pick_up_chest_card.addEventListener("click", function () {
    random_chest_card();
    hide_element(button_pick_up_chest_card);
    show_element(button_ok);
    console.log(selectedCard.text);
});

const button_pick_up_chance_card = document.getElementById("button_pick_up_chance_card");
button_pick_up_chance_card.addEventListener("click", function () {
    random_chance_card();
    hide_element(button_pick_up_chance_card);
    show_element(button_ok);
    console.log(selectedCard.text);
});

const button_ok = document.getElementById("button_ok");
button_ok.addEventListener("click", function () {
    selectedCard.action();
    selectedCard = [];
    player_completed_turn();
});

const hide_all_buttons = () => {
    hide_element(button_roll_dice);
    hide_element(button_roll_dice_in_jail);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay_50);
    hide_element(button_pay_200);
    hide_element(button_use_jail_card);
    hide_element(button_pick_up_chest_card);
    hide_element(button_pick_up_chance_card);
    hide_element(button_ok);
}

const hide_element = (element) => {
    element.style.display = "none";
}

const show_element = (element) => {
    element.style.display = "block";
}

/*------ UPDATE PLAYERS CONTAINERS ------*/

const update_players_containers = () => {

    players.forEach(player => {
        // WALLET
        document.getElementById(`player_wallet_${player.id}`).innerHTML = `$ ${player.wallet}`;

        // LOST OF PROPERTIES
        var element = document.getElementById(`player_properties_${player.id}`);
        element.innerHTML = "";

        player.propertiesOwn.forEach(property => {
            var tag = document.createElement("li");
            var text = document.createTextNode(`${property.name}`);
            tag.appendChild(text);
            element.appendChild(tag);
        });

        // FREE JAIL CARD

        // TO DO

        // COLOR IN NAME

        document.getElementById(`player_name_${currentPlayer.id}`).classList.add(`player-${currentPlayer.color}-turn`);
        const notCurrentPlayersIds = allPlayersIds.filter(playerId => playerId !== currentPlayerId);
        notCurrentPlayersIds.forEach(playerId => {
            document.getElementById(`player_name_${playerId}`).classList.remove(`player-${players[playerId].color}-turn`);
        });
    });
}

/*---------------------- INITIAL GAMEPLAY SETUP ----------------------*/

let currentPlayerId = 0; // NEEDS CONSTANT UPDATE
let currentPlayer = players[currentPlayerId]; // NEEDS CONSTANT UPDATE
let currentSquare = squares[currentPlayer.position]; // NEEDS CONSTANT UPDATE
let diceResult = [];

/*---------------------- GAME PLAY ----------------------*/

/*------ STEP 1 ------*/
const new_turn = () => {

    hide_all_buttons();
    update_players_containers();
    console.log(`its ${currentPlayer.name} (Id ${currentPlayerId}) turn`);

    if (currentPlayer.isInJail) {
        /*--- IS IN JAIL ---*/
        console.log(`You are in jail. (currentPlayer.isInJail = ${currentPlayer.isInJail}`);
        show_element(button_pay_50);
        show_element(button_roll_dice_in_jail);

        if (currentPlayer.jailCard) {
            /*--- YES JAIL CARD ---*/
            console.log(`You have jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
            show_element(button_use_jail_card);
        } else {
            /*--- NO JAIL CARD ---*/
            console.log(`You don't have jail card`);
        }

    } else {
        /*--- IS NOT IN JAIL ---*/
        console.log("not in jail");
        show_element(button_roll_dice);

        if (currentPlayer.position === 20) {
            /*--- IS ON FREE PARKING ---*/
            console.log(`${currentPlayer.name}} is in free parking, you can stay or roll dice and move`);
            show_element(button_end_turn);
        }
    }
}

/*------ STEP 2 ------*/

const player_rolled_dices = () => {

    hide_all_buttons();
    show_element(button_move);
}

/*------ STEP 3 ------*/
const player_moved = () => {

    hide_all_buttons();

    if (currentPlayer.position === 2 || currentPlayer.position === 17 || currentPlayer.position === 33) {
        /*------ IS IN CHEST ------*/
        console.log(`current player is in chest`);
        show_element(button_pick_up_chest_card);


    } else if (currentPlayer.position === 7 || currentPlayer.position === 22 || currentPlayer.position === 36) {
        /*------ IS IN CHANCE ------*/
        console.log(`current player is in chance`);
        show_element(button_pick_up_chance_card);

    } else if (currentPlayer.position === 10 || currentPlayer.position === 20) {
        /*------ IS IN JUST VISITIN OF FREE PARKING? ------*/
        console.log(`current player is in just visiting or free parking`);
        show_element(button_end_turn);

    } else if (currentPlayer.position === 4) {
        /*------ IS IN INCOME TAX ------*/
        console.log(`current player is in Income Tax`);
        show_element(button_pay_200);

    } else {
        /*------ IS ON PROPERTY ------*/
        console.log(`current player is in on property`);

        show_element(button_buy);
        show_element(button_end_turn);

        // CHECK OWNER

        // TODO
    }

}
/*------ STEP 4 ------*/
const player_completed_turn = () => {

    hide_all_buttons();

    show_element(button_end_turn);
}
