/*---------------------- INITIAL GAMEPLAY SETUP ----------------------*/

let currentPlayerId = undefined;
let currentPlayer = [];
let currentSquare = [];
let diceResult = [];
let consoleMessages = [];
let currentTurnStatus = {
    "playerHasRolled": false,
    "playerHasMoved": false,
    "playerHasFinished": false
}
let players = [];
let allPlayersIds = [];

/*------ CONSOLE ------*/

const message = (text) => {
    $("#console-display").prepend(`<p>${text}</p>`);
    consoleMessages.push(text);
}

/*------ CONTROL PANNEL BUTTONS ------*/

// GENERAL USAGE
const all_buttons = document.getElementById("control_buttons");
all_buttons.addEventListener("click", function () {
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
    player_moved();
});

const button_end_turn = document.getElementById("button_end_turn");
button_end_turn.addEventListener("click", function () {
    currentPlayer.endTurn();
    currentTurnStatus = {
        "playerHasRolled": false,
        "playerHasMoved": false,
        "playerHasFinished": false
    }
    new_turn();
    diceResult = [];
});

// FOR JAIL
const button_use_jail_card = document.getElementById("button_use_jail_card");
button_use_jail_card.addEventListener("click", function () {
    currentPlayer.getOutOfJail();
    message(`You used your jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
    player_completed_turn();
});

const button_roll_dice_in_jail = document.getElementById("button_roll_dice_in_jail");
button_roll_dice_in_jail.addEventListener("click", function () {
    currentPlayer.rollDices();
    player_completed_turn();
    /*------ ROLLED DOUBLES? ------*/
    if (currentPlayer.throwDoubles) {
        /*--- YES ---*/
        message(`You throw doubles. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
        currentPlayer.getOutOfJail();
    } else {
        /*--- NO ---*/
        message(`No doubles, you lost turn. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
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

const button_pay_rent = document.getElementById("button_pay_rent");
button_pay_rent.addEventListener("click", function () {
    let rent = calculateRent() * multiplier;
    currentPlayer.wallet -= rent;
    players[currentSquare.owner].wallet += rent;
    message(`${currentPlayer.name} paid $${rent} to ${players[currentSquare.owner].name}`);
    player_completed_turn();
});

const button_pay_rent_utility = document.getElementById("button_pay_rent_utility");
button_pay_rent_utility.addEventListener("click", function () {
    let rent = calculateRent() * diceResult[2];
    currentPlayer.wallet -= rent;
    players[currentSquare.owner].wallet += rent;
    message(`${currentPlayer.name} paid $${rent} to ${players[currentSquare.owner].name}`);
    player_completed_turn();
});

const button_roll_dice_utility = document.getElementById("button_roll_dice_utility");
button_roll_dice_utility.addEventListener("click", function () {
    diceResult = currentPlayer.rollDices();
    hide_element(button_roll_dice_utility);
    show_element(button_pay_rent_utility);
    message(`${currentPlayer.name} needs to pay $${calculateRent() * diceResult[2]} to ${players[currentSquare.owner].name}`);
});

// FOR CARDS
const button_pick_up_chest_card = document.getElementById("button_pick_up_chest_card");
button_pick_up_chest_card.addEventListener("click", function () {
    random_chest_card();
    hide_element(button_pick_up_chest_card);
    show_element(button_ok);
    message(selectedCard.text);
});

const button_pick_up_chance_card = document.getElementById("button_pick_up_chance_card");
button_pick_up_chance_card.addEventListener("click", function () {
    random_chance_card();
    hide_element(button_pick_up_chance_card);
    show_element(button_ok);
    message(selectedCard.text);
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
    hide_element(button_pay_rent);
    hide_element(button_roll_dice_utility);
    hide_element(button_pay_rent_utility);
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
        // LIST OF PROPERTIES
        let element = document.getElementById(`player_properties_${player.id}`);
        element.innerHTML = "";
        player.propertiesOwn.forEach(property => {
            let tag = document.createElement("li");
            let text = document.createTextNode(`${property.name}`);
            tag.appendChild(text);
            element.appendChild(tag);
        });

        // FREE JAIL CARD

        // TODO



    });
    // COLOR IN NAME
    document.getElementById(`player_name_${currentPlayer.id}`).classList.add(`player-${currentPlayer.color}-turn`);
    const notCurrentPlayersIds = allPlayersIds.filter(playerId => playerId !== currentPlayerId);
    notCurrentPlayersIds.forEach(playerId => {
        document.getElementById(`player_name_${playerId}`).classList.remove(`player-${players[playerId].color}-turn`);
    });
}

/*---------------------- GAME PLAY ----------------------*/

hide_all_buttons();

/*------ STEP 0 ------*/

const start_new_game = () => {
    currentPlayerId = 0; // NEEDS CONSTANT UPDATE
    currentPlayer = players[currentPlayerId]; // NEEDS CONSTANT UPDATE
    currentSquare = squares[currentPlayer.position]; // NEEDS CONSTANT UPDATE
    diceResult = [];
}

const new_turn = () => {

    hide_all_buttons();
    update_players_containers();
    message(`It's ${currentPlayer.name} (Id ${currentPlayerId}) turn.`);

    if (currentPlayer.isInJail) {
        /*--- IS IN JAIL ---*/
        message(`You are in jail. (currentPlayer.isInJail = ${currentPlayer.isInJail}`);
        show_element(button_pay_50);
        show_element(button_roll_dice_in_jail);

        if (currentPlayer.jailCard) {
            /*--- YES JAIL CARD ---*/
            message(`You have jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
            show_element(button_use_jail_card);
        } else {
            /*--- NO JAIL CARD ---*/
            message(`You don't have jail card`);
        }

    } else {
        /*--- IS NOT IN JAIL ---*/
        console.log("not in jail");
        show_element(button_roll_dice);

        if (currentPlayer.position === 20) {
            /*--- IS ON FREE PARKING ---*/
            message(`${currentPlayer.name}} is in free parking, you can stay or roll dice and move`);
            show_element(button_end_turn);
        }
    }
}

/*------ STEP 2 ------*/

const player_rolled_dices = () => {
    currentTurnStatus.playerHasRolled = true;
    hide_all_buttons();
    show_element(button_move);

}

/*------ STEP 3 ------*/
const player_moved = () => {
    currentTurnStatus.playerHasMoved = true;

    hide_all_buttons();

    if (currentPlayer.position === 2 || currentPlayer.position === 17 || currentPlayer.position === 33) {
        /*------ IS IN CHEST ------*/
        message(`current player is in chest`);
        show_element(button_pick_up_chest_card);


    } else if (currentPlayer.position === 7 || currentPlayer.position === 22 || currentPlayer.position === 36) {
        /*------ IS IN CHANCE ------*/
        message(`current player is in chance`);
        show_element(button_pick_up_chance_card);

    } else if (currentPlayer.position === 10 || currentPlayer.position === 20) {
        /*------ IS IN JUST VISITIN OF FREE PARKING? ------*/
        message(`${currentPlayer.name} is in just visiting or free parking`);
        show_element(button_end_turn);

    } else if (currentPlayer.position === 4) {
        /*------ IS IN INCOME TAX ------*/
        message(`current player is in Income Tax`);
        show_element(button_pay_200);

    } else {
        /*------ IS ON PROPERTY ------*/

        // CHECK OWNER
        if (currentSquare.owner === undefined) {
            // NO OWNER
            console.log(`current player is in on property with NO owner`);
            show_element(button_buy);
            show_element(button_end_turn);
        } else {

            console.log(`current player is in on property with YES owner`);
            if (currentSquare.owner === currentPlayerId) {
                // OWNER IS CURRENT PLAYER
                console.log(`its your property`);
                show_element(button_end_turn);
            } else {
                // OWNER IS OTHER PLAYER
                if (currentPlayer.position === 12 || currentPlayer.position === 28) {
                    // UTILITY
                    show_element(button_roll_dice_utility);
                    if (calculateRent() === 4) {

                        message(`${players[currentSquare.owner].name} only owns this utility. To determine rent, roll dices and the result will be multiplied by 4.`);

                    } else if (calculateRent() === 10) {

                        message(`${players[currentSquare.owner].name} owns both utilities. To determine rent, roll dices and the result will be multiplied by 10.`);

                    } else {

                        console.error("Something went wrong");

                    }

                } else {
                    // REGULAR PROPERTY
                    show_element(button_pay_rent);
                    message(`${currentPlayer.name} needs to pay $${calculateRent()} to ${players[currentSquare.owner].name}`);
                }


            }


        }
    }

}

/*------ STEP 4 ------*/
const player_completed_turn = () => {
    currentTurnStatus.playerHasFinished = true;
    hide_all_buttons();
    show_element(button_end_turn);
}