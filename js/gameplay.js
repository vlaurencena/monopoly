/*---------------------- INITIAL GAMEPLAY SETUP ----------------------*/
const diceAnimationDuration = 50;
const moveTokenAnimation = 250;
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
    checkPlayerNoMoney();
});

const button_roll_dice = document.getElementById("button_roll_dice");
button_roll_dice.addEventListener("click", function () {
    hideElement(button_roll_dice);
    diceResult = currentPlayer.rollDices();
    animateDices(diceResult[0], diceResult[1]);
    console.log("im gere");
    playerRolledDices();
    setTimeout(function () {
        showElement(button_move);
    }, diceAnimationDuration);
});

const button_move = document.getElementById("button_move");
button_move.addEventListener("click", function () {
    currentPlayer.move(diceResult[2]);
    setTimeout(function () {
        playerMoved();
    }, diceResult[2] * moveTokenAnimation + 100);
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
        message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> throwed doubles and its free now!`);
        currentPlayer.getOutOfJail();
    } else {
        /*--- NO ---*/
        message(`$<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> didn't throw doubles and lost his/her turn.`);
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
        message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> paid $${rent} to <span class="player-${players[currentSquare.owner].color}-turn">${players[currentSquare.owner].name}</span>.`);
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
    $("#button_end_turn").html("End turn");
    hideAllConsoleButtons();
    message(`It's <span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> turn.`);

    if (currentPlayer.inJail) {
        /*--- IS IN JAIL ---*/
        showElement(button_pay_50);
        showElement(button_roll_dice_in_jail);

        if (currentPlayer.jailCard) {
            /*--- YES JAIL CARD ---*/
            message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in jail. You can pay $50, try to get doubles or use your card.`);
            showElement(button_use_jail_card);
        } else {
            /*--- NO JAIL CARD ---*/
            message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in jail. You can pay $50 or try to get doubles.`);
        }

    } else {
        /*--- IS NOT IN JAIL ---*/
        showElement(button_roll_dice);

        if (currentPlayer.position === 20) {
            /*--- IS ON FREE PARKING ---*/
            message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in free parking, you can stay or roll dice and move`);
            showElement(button_end_turn);
        }

    }
}

/*------ STEP 2 ------*/

const playerRolledDices = () => {
    hideAllConsoleButtons();
    currentTurnStatus.playerHasRolled = true;
}

/*------ STEP 3 ------*/
let comesFromCard = false;

const playerMoved = () => {
    hideAllConsoleButtons();
    currentTurnStatus.playerHasMoved = true;

    if (currentPlayer.anotherTurn) {
        $("#button_end_turn").html("Play again");
    }

    if (currentPlayer.position === 2 || currentPlayer.position === 17 || currentPlayer.position === 33) {
        /*------ IS IN CHEST ------*/
        message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in Community Chest. Pick a card!`);
        showElement(button_pick_up_chest_card);

    } else if (currentPlayer.position === 7 || currentPlayer.position === 22 || currentPlayer.position === 36) {
        /*------ IS IN CHANCE ------*/
        message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is in Chance. Pick a card!`);
        showElement(button_pick_up_chance_card);

    } else if (currentPlayer.position === 10 || currentPlayer.position === 20) {
        /*------ IS IN JUST VISITIN OF FREE PARKING? ------*/
        showElement(button_end_turn);
        if (currentPlayer.position === 10) {
            message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> is just visiting jail.`);
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
            showElement(button_buy);
            showElement(button_end_turn);
        } else {
            // HAS OWNER
            if (currentSquare.owner === currentPlayerId || currentSquare.mortage === true) {
                // OWNER IS CURRENT PLAYER OR PROPERTY IS MORTAGE
                console.log(`Its his/her own property or property has mortage`);
                showElement(button_end_turn);
            } else {
                // OWNER IS OTHER PLAYER AND PROPERTY IS NOT MORTAGE
                if (currentPlayer.position === 12 || currentPlayer.position === 28) {
                    // UTILITY
                    showElement(button_roll_dice_utility);
                    if (calculateRent(currentSquare) === 4) {
                        message(`${players[currentSquare.owner].name} only owns this utility. To determine rent, roll dices and the result will be multiplied by 4.`);
                    } else if (calculateRent(currentSquare) === 10) {
                        message(`${players[currentSquare.owner].name} only owns both utility. To determine rent, roll dices and the result will be multiplied by 10.`);
                    } else {
                        console.error("Something went wrong");
                    }
                } else {
                    // REGULAR PROPERTY
                    showElement(button_pay_rent);
                    message(`<span class="player-${currentPlayer.color}-turn">${currentPlayer.name}</span> needs to pay $${calculateRent(currentSquare)} to <span class="player-${players[currentSquare.owner].color}-turn">${players[currentSquare.owner].name}</span>.`);
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

// TODO ROLL DICES BUTTON DOESN'T HIDE AFTER CLICK AND MOVE NEVER APPERAS