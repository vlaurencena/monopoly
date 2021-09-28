/*---------------------- INITIAL GAMEPLAY SETUP ----------------------*/
const diceAnimationDuration = 10;
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

/*------ CONTROL PANNEL BUTTONS ------*/

// GENERAL USAGE
const all_buttons = document.getElementById("control_buttons");
all_buttons.addEventListener("click", function () {
    updateAllBoard();
    //    checkPlayerNoMoney();
});

const button_roll_dice = document.getElementById("button_roll_dice");
button_roll_dice.addEventListener("click", function () {
    diceResult = currentPlayer.rollDices();
    animateDices(diceResult[0], diceResult[1]);
    playerRolledDices();
});

const button_move = document.getElementById("button_move");
button_move.addEventListener("click", function () {
    currentPlayer.move(diceResult[2]);
    playerMoved();
});

const button_end_turn = document.getElementById("button_end_turn");
button_end_turn.addEventListener("click", function () {
    currentPlayer.endTurn();
    currentTurnStatus = {
        "playerHasRolled": false,
        "playerHasMoved": false,
        "playerHasFinished": false
    }
    newTurn();
    diceResult = [];
    updateAllBoard();
});

// FOR JAIL
const button_use_jail_card = document.getElementById("button_use_jail_card");
button_use_jail_card.addEventListener("click", function () {
    currentPlayer.getOutOfJail();
    message(`You used your jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
    playerCompletedTurn();
    updateAllBoard();
});

const button_roll_dice_in_jail = document.getElementById("button_roll_dice_in_jail");
button_roll_dice_in_jail.addEventListener("click", function () {
    currentPlayer.rollDices();
    playerCompletedTurn();
    /*------ ROLLED DOUBLES? ------*/
    if (currentPlayer.throwDoubles) {
        /*--- YES ---*/
        message(`You throw doubles. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
        currentPlayer.getOutOfJail();
    } else {
        /*--- NO ---*/
        message(`No doubles, you lost turn. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
        // TODO After 3rd attempt to roll doubles, you must pay the $50 fine and leave jail.
    }
});

const button_pay_50 = document.getElementById("button_pay_50");
button_pay_50.addEventListener("click", function () {
    if (playerCanAfford(currentPlayer, 50)) {
        currentPlayer.transaction(-50);
        currentPlayer.getOutOfJail();
        playerCompletedTurn();
        updateAllBoard();
    }
});

// FOR TAX INCOME
const button_pay_200 = document.getElementById("button_pay_200");
button_pay_200.addEventListener("click", function () {
    if (playerCanAfford(currentPlayer, 200)) {
        currentPlayer.transaction(-200);
        playerCompletedTurn();
        updateAllBoard();
    }
});

const button_pay_75 = document.getElementById("button_pay_75");
button_pay_75.addEventListener("click", function () {
    if (playerCanAfford(currentPlayer, 75)) {
        currentPlayer.transaction(-75);
        playerCompletedTurn();
        updateAllBoard();
    }
});

// FOR PROPERTIES
const button_buy = document.getElementById("button_buy");
button_buy.addEventListener("click", function () {
    if (playerCanAfford(currentPlayer, property.price)) {
        currentPlayer.buyProperty(currentSquare);
        playerCompletedTurn();
        updateAllBoard();
    }
});

const button_pay_rent = document.getElementById("button_pay_rent");
button_pay_rent.addEventListener("click", function () {
    let rent = calculateRent(currentSquare);
    if (playerCanAfford(currentPlayer, rent)) {
        currentPlayer.wallet -= rent;
        players[currentSquare.owner].wallet += rent;
        message(`${currentPlayer.name} paid $${rent} to ${players[currentSquare.owner].name}`);
        comesFromCard = false;
        playerCompletedTurn();
        updateAllBoard();
    }
});

let multiplier = undefined;

const button_pay_rent_utility = document.getElementById("button_pay_rent_utility");
button_pay_rent_utility.addEventListener("click", function () {
    let rent = calculateRent(currentSquare) * multiplier;
    if (playerCanAfford(currentPlayer, rent)) {
        currentPlayer.wallet -= rent;
        players[currentSquare.owner].wallet += rent;
        message(`${currentPlayer.name}paid $${rent} to ${players[currentSquare.owner].name}`);
        comesFromCard = false;
        playerCompletedTurn();
        updateAllBoard();
    }
});

const button_roll_dice_utility = document.getElementById("button_roll_dice_utility");
button_roll_dice_utility.addEventListener("click", function () {
    let dice1 = Math.ceil(Math.random() * 6);
    let dice2 = Math.ceil(Math.random() * 6);
    multiplier = dice1 + dice2;
    animateDices(dice1, dice2);
    message(`${currentPlayer.name} needs to pay $${calculateRent(currentSquare) * multiplier} to ${players[currentSquare.owner].name}`);
    hideElement(button_roll_dice_utility);
    showElement(button_pay_rent_utility);
});

// FOR CARDS
const button_pick_up_chest_card = document.getElementById("button_pick_up_chest_card");
button_pick_up_chest_card.addEventListener("click", function () {
    random_chest_card();
    hideElement(button_pick_up_chest_card);
    showElement(button_ok);
    message(selectedCard.text);
});

const button_pick_up_chance_card = document.getElementById("button_pick_up_chance_card");
button_pick_up_chance_card.addEventListener("click", function () {
    random_chance_card();
    hideElement(button_pick_up_chance_card);
    showElement(button_ok);
    message(selectedCard.text);
});

const button_ok = document.getElementById("button_ok");
button_ok.addEventListener("click", function () {
    selectedCard.action();
    selectedCard = [];
    updateAllBoard();
    playerCompletedTurn();
});

/*---------------------- GAME PLAY ----------------------*/

hideAllConsoleButtons();

/*------ STEP 0 ------*/

const startNewGame = () => {
    currentPlayerId = 0; // NEEDS CONSTANT UPDATE
    currentPlayer = players[currentPlayerId]; // NEEDS CONSTANT UPDATE
    currentSquare = squares[currentPlayer.position]; // NEEDS CONSTANT UPDATE
    diceResult = [];
}

const newTurn = () => {
    updatePlayersContainers();
    $("#button_end_turn").html("End turn");
    hideAllConsoleButtons();
    // TODO update createPlayersContainers();
    message(`It's <span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> turn.`);

    if (currentPlayer.inJail) {
        /*--- IS IN JAIL ---*/
        message(`You are in jail. (currentPlayer.inJail = ${currentPlayer.inJail}`);
        showElement(button_pay_50);
        showElement(button_roll_dice_in_jail);

        if (currentPlayer.jailCard) {
            /*--- YES JAIL CARD ---*/
            message(`You have jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
            showElement(button_use_jail_card);
        } else {
            /*--- NO JAIL CARD ---*/
            message(`You don't have jail card`);
        }

    } else {
        /*--- IS NOT IN JAIL ---*/
        console.log("not in jail");
        showElement(button_roll_dice);

        if (currentPlayer.position === 20) {
            /*--- IS ON FREE PARKING ---*/
            message(`${currentPlayer.name}} is in free parking, you can stay or roll dice and move`);
            showElement(button_end_turn);
        }
    }
}

/*------ STEP 2 ------*/

const playerRolledDices = () => {
    currentTurnStatus.playerHasRolled = true;
    hideAllConsoleButtons();
    setTimeout(function () {
        showElement(button_move)
    }, diceAnimationDuration + 10);

}

/*------ STEP 3 ------*/
let comesFromCard = false;

const playerMoved = () => {
    currentTurnStatus.playerHasMoved = true;
    if (currentPlayer.anotherTurn) {
        $("#button_end_turn").html("Play again");
    }
    hideAllConsoleButtons();

    if (currentPlayer.position === 2 || currentPlayer.position === 17 || currentPlayer.position === 33) {
        /*------ IS IN CHEST ------*/
        message(`current player is in chest`);
        showElement(button_pick_up_chest_card);


    } else if (currentPlayer.position === 7 || currentPlayer.position === 22 || currentPlayer.position === 36) {
        /*------ IS IN CHANCE ------*/
        message(`current player is in chance`);
        showElement(button_pick_up_chance_card);

    } else if (currentPlayer.position === 10 || currentPlayer.position === 20) {
        /*------ IS IN JUST VISITIN OF FREE PARKING? ------*/
        showElement(button_end_turn);

        if (currentPlayer.position === 10) {
            message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in just visiting`);
        } else {
            message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is on freeparking.`);
        }

    } else if (currentPlayer.position === 4) {
        /*------ IS IN INCOME TAX ------*/
        message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in Income Tax and needs to pay $200.`);
        showElement(button_pay_200);
    } else if (currentPlayer.position === 38) {
        message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in Luxury Tax and needs to pay $75.`);
        showElement(button_pay_75);
    } else {
        /*------ IS ON PROPERTY ------*/
        // CHECK OWNER
        if (currentSquare.owner === undefined) {
            // NO OWNER
            console.log(`current player is in on property with NO owner`);
            showElement(button_buy);
            showElement(button_end_turn);

        } else {
            console.log(`current player is in on property with YES owner`);
            if (currentSquare.owner === currentPlayerId || currentSquare.mortage === true) {
                // OWNER IS CURRENT PLAYER OR PROPERTY IS MORTAGE
                console.log(`its your property`);
                showElement(button_end_turn);
            } else {
                // OWNER IS OTHER PLAYER AND PROPERTY IS NOT MORTAGE
                if (currentPlayer.position === 12 || currentPlayer.position === 28) {
                    // UTILITY
                    showElement(button_roll_dice_utility);
                    if (calculateRent(currentSquare) === 4) {

                        message(`${players[currentSquare.owner].name} only owns this utility. To determine rent, roll dices and the result will be multiplied by 4.`);

                    } else if (calculateRent(currentSquare) === 10) {
                        message(`${players[currentSquare.owner].name} only owns this utility. To determine rent, roll dices and the result will be multiplied by 10.`);
                    } else {
                        console.error("Something went wrong");
                    }


                } else {
                    // REGULAR PROPERTY
                    showElement(button_pay_rent);
                    message(`${currentPlayer.name} needs to pay $${calculateRent(currentSquare)} to ${players[currentSquare.owner].name}`);
                }
            }
        }
    }
}

/*------ STEP 4 ------*/
const playerCompletedTurn = () => {
    currentTurnStatus.playerHasFinished = true;
    hideAllConsoleButtons();
    showElement(button_end_turn);
}