/*----- VARIABLES ------*/

let arrayOfProperties = squares.filter(property => property.price !== undefined);
let propertiesIds = arrayOfProperties.map(property => property.id);

/*----- OPEN AND CLOSE RULES ------*/

$("#button_close_rules").click(function () {
    $(".rules-container").hide();
});

$(".open-rules-monopoly ").click(function () {
    $(".rules-container").show();
});

/*----- ROLL DICE ------*/

const getDicesResult = () => {
    let dice1 = Math.ceil(Math.random() * 6);
    let dice2 = Math.ceil(Math.random() * 6);
    console.log([dice1, dice2, dice1 + dice2]);
    return [dice1, dice2, dice1 + dice2];
}

/*----- ANIMATE ROLL DICE ------*/

const animateDices = (dice1, dice2) => {
    document.getElementById(`dice_1`).classList.add("animation-roll-dices");
    document.getElementById(`dice_2`).classList.add("animation-roll-dices");

    let i = 0;
    for (i; i <= 10; i++) {
        setTimeout(() => {
            document.getElementById(`dice_1`).src = `media/dice-${Math.ceil(Math.random() * 6)}.svg`;
            document.getElementById(`dice_2`).src = `media/dice-${Math.ceil(Math.random() * 6)}.svg`;
        }, i * (diceAnimationDuration / 10));
    }

    setTimeout(() => {
        document.getElementById(`dice_1`).src = `media/dice-${dice1}.svg`;
        document.getElementById(`dice_2`).src = `media/dice-${dice2}.svg`;
        document.getElementById(`dice_1`).classList.remove("animation-roll-dices");
        document.getElementById(`dice_2`).classList.remove("animation-roll-dices");
    }, (diceAnimationDuration) + 10);
}

/*------ CONSOLE ------*/

const message = (text) => {
    $("#console-display").prepend(`<p>${text}</p>`);
    consoleMessages.push(text);
}

const show_element = (element) => {
    element.style.display = "block";
}

const hide_element = (element) => {
    element.style.display = "none";
}

const hide_all_buttons = () => {
    hide_element(button_roll_dice);
    hide_element(button_roll_dice_in_jail);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay_50);
    hide_element(button_pay_75);
    hide_element(button_pay_200);
    hide_element(button_use_jail_card);
    hide_element(button_pick_up_chest_card);
    hide_element(button_pick_up_chance_card);
    hide_element(button_ok);
    hide_element(button_pay_rent);
    hide_element(button_roll_dice_utility);
    hide_element(button_pay_rent_utility);
}
/*------ UPDATE SQUARES DISPLAY ------*/

const updateSquaresDisplay = () => {
    for (property of arrayOfProperties) {

        if (property.owner !== undefined) {
            $(`#square-${property.id}`).addClass(`property-of-player-${players[property.owner].color}`);
        } else if (property.owner === undefined) {
            players.forEach(function (player) {
                $(`#square-${property.id}`).removeClass(`property-of-player-${player.color}`);
            });
        }
    }
    updateAllHousesAndMortageDisplay();
}

/*------ UPDATE PLAYERS CONTAINERS ------*/

const updatePlayersContainers = () => {
    console.log(players);
    players.forEach(player => {
        //WALLET
        document.getElementById(`player_wallet_${player.id}`).innerHTML = `$ ${player.wallet}`;
        // LIST OF PROPERTIES
        $(`#player_properties_${player.id}`).empty();
        let propertiesOwnByThisPlayer = arrayOfProperties.filter(property => property.owner === player.id);
        propertiesOwnByThisPlayer.forEach(property => {
            $(`#player_properties_${property.owner}`).append(`<li>${property.name}</li>`);
        })
        // FREE JAIL CARD
        $(`#player_jail_card_${player.id}`).html(`Free Jail Card? ${player.jailCard}`);
    });
    // COLOR IN NAME
    document.getElementById(`player_name_${currentPlayer.id}`).classList.add(`player-${currentPlayer.color}-turn`);
    let currentPlayersIds = players.map(player => player.id);
    let notCurrentPlayersIds = currentPlayersIds.filter(playerId => playerId !== currentPlayerId);
    notCurrentPlayersIds.forEach(playerId => {
        document.getElementById(`player_name_${playerId}`).classList.remove(`player-${players[playerId].color}-turn`);
    });
}

/*------ UPDATE ALL BOARD ------*/

const updateAllBoard = () => {
    updateSquaresDisplay();
    updatePlayersContainers();
}

// VALIDATE HOUSE BUY & SELL

let checkAllOwnersTheSame = (property) => { // OBJECT
    let allOwnersTheSame = true;
    let groupPropertiesIds = property.groupIDs;
    let groupPropertiesOwners = [];
    for (let property of groupPropertiesIds) {
        groupPropertiesOwners.push(squares[property].owner);
    }
    for (owner of groupPropertiesOwners) {
        if (owner !== property.owner || owner === undefined) {
            allOwnersTheSame = false;
        }
    }
    return allOwnersTheSame;
}

const checkPropertyCanBuyHouse = (property) => { // (OBJECT)
    let canBuy = true;
    let groupPropertiesIds = property.groupIDs;
    let groupProperties = [];
    for (let property of groupPropertiesIds) {
        groupProperties.push(squares[property]);
    }
    for (let i = 0; i < groupProperties.length; i++) {
        if (property.house >= 5 || property.house > groupProperties[i].house) {
            canBuy = false;
        }
    }
    return canBuy;
}

let checkPropertyCanSellHouse = (property) => { // (OBJECT)
    let canSell = true;
    let groupPropertiesIds = property.groupIDs;
    let groupProperties = [];
    for (let property of groupPropertiesIds) {
        groupProperties.push(squares[property]);
    }
    for (let i = 0; i < groupProperties.length; i++) {
        if (property.house <= 0 || property.house < groupProperties[i].house) {
            canSell = false;
        }
    }
    return canSell;
}

// PERFORM HOUSE BUY & SELL
const buyHouse = (property) => { // (OBJECT)
    property.house += 1;
    players[property.owner].transaction(-property.housePrice);
    updateHousesAndMortageDisplay(property);
}

const sellHouse = (property) => { // (OBJECT)
    property.house -= 1;
    players[property.owner].transaction(property.housePrice / 2);
    updateHousesAndMortageDisplay(property);
}

const updateHousesAndMortageDisplay = (property) => { // (OBJECT)
    if (property.mortage === true) {
        if (property.id === 5 || property.id === 12 || property.id === 15 || property.id === 25 || property.id === 28 || property.id === 35) {
            $(`#square-${property.id}`).prepend(`<p class="mortage-sign">M</p>`);
        } else {
            $(`#square-${property.id}`).children(".square-color").html(`<p class="mortage-sign">M</p>`);
        }
    } else if (property.mortage === false) {
        if (property.id === 5 || property.id === 12 || property.id === 15 || property.id === 25 || property.id === 28 || property.id === 35) {
            $(`#square-${property.id}`).find(".mortage-sign").remove();
        } else {
            $(`#square-${property.id}`).children(".square-color").html("");
        }
        let squareColor = $(`#square-${property.id}`).children(".square-color");
        squareColor.empty();
        if (property.house === 0) {
            // DO NOTHING
        } else if (property.house > 0 && property.house < 5) {
            for (let i = 0; i < property.house; i++) {
                squareColor.append(`<img class="house-icon" src="media/house-icon.svg" alt="">`);
            }
        } else if (property.house === 5) {
            squareColor.append(`<img class="hotel-icon" src="media/hotel-icon.svg" alt="">`);
        } else {
            console.error("House doesn't have a correct number of houses");
        }
    } else {
        console.error("Something went wrong");
    }
}

const updateAllHousesAndMortageDisplay = () => {
    for (property of arrayOfProperties) {
        updateHousesAndMortageDisplay(property);
    }
}

// MORTAGE
const setMortage = (property) => {
    players[property.owner].transaction(property.mortageValue);
    property.mortage = true;
    createDeedCard(property);
    updateHousesAndMortageDisplay(property);
}
const liftMortage = (property) => {
    players[property.owner].transaction(-(Math.round(property.mortageValue * 1.10)));
    property.mortage = false;
    createDeedCard(property);
    updateHousesAndMortageDisplay(property);
}

const removeSellPropertyDisplay = () => {
    $(".sell-property-container").remove();
}

const calculateRent = (property) => {
    if (property.id === 12 || property.id === 28) {
        // UTILITY
        if (comesFromCard === true) {
            return 10;
        } else if (comesFromCard === false) {
            if (squares[12].owner === squares[28].owner) {
                return 10;
            } else {
                return 4;
            }
        }
    } else if (property.id === 5 || property.id === 15 || property.id === 25 || property.id === 35) {
        // RAILROAD
        let arrayOfRailroads = [squares[5], squares[15], squares[25], squares[35]];
        let counter = 0;
        for (let railroad of arrayOfRailroads) {
            if (property.owner === railroad.owner) {
                counter++;
            }
        }
        if (comesFromCard === false) {
            if (counter === 1) {
                return 25;
            } else if (counter === 2) {
                return 50;
            } else if (counter === 3) {
                return 100;
            } else if (counter === 4) {
                return 200;
            }
        } else if (comesFromCard === true) {
            if (counter === 1) {
                return 50;
            } else if (counter === 2) {
                return 100;
            } else if (counter === 3) {
                return 200;
            } else if (counter === 4) {
                return 400;
            }
        }

    } else {

        switch (property.house) {
            case 1:
                return property.rent1;
                break;
            case 2:
                return property.rent2;
                break;
            case 3:
                return property.rent3;
                break;
            case 4:
                return property.rent4;
                break;
            case 5:
                return property.rent5;
                break;
            default:
                return property.baseRent;
        }
    }
};




// TODO If player owns ALL the Lots of any Color Group, the rent is Doubled on Uninproved Lots in that group.