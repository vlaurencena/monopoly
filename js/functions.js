const arrayOfProperties = () => {
    return squares.filter(property => property.price !== undefined);
}

const propertiesIds = arrayOfProperties().map(property => property.id);

for (id of propertiesIds) {
    document.getElementById(`square-${id}`).style.cursor = "pointer";
}

/*----- ROLL DICE ------*/
const getDicesResult = () => {
    let dice1 = Math.ceil(Math.random() * 6);
    let dice2 = Math.ceil(Math.random() * 6);
    console.log(`Dice result is: ${[dice1, dice2, dice1 + dice2]}`);
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
    if (text !== consoleMessages[consoleMessages.length - 1]) {
        $("#console-display").prepend(`<p>${text}</p>`);
        consoleMessages.push(text);
    } else {
        // DO NOTHING
    }
}

const showElement = (element) => {
    element.style.display = "block";
}

const hideElement = (element) => {
    element.style.display = "none";
}

const hideAllConsoleButtons = () => {
    hideElement(button_roll_dice);
    hideElement(button_roll_dice_in_jail);
    hideElement(button_move);
    hideElement(button_buy);
    hideElement(button_end_turn);
    hideElement(button_pay_50);
    hideElement(button_pay_75);
    hideElement(button_pay_200);
    hideElement(button_use_jail_card);
    hideElement(button_pick_up_chest_card);
    hideElement(button_pick_up_chance_card);
    hideElement(button_ok);
    hideElement(button_pay_rent);
    hideElement(button_roll_dice_utility);
    hideElement(button_pay_rent_utility);
}

/*------ PLAYERS' CONTAINERS ------*/
const createPlayersContainers = () => {

    players.forEach(function (player) {
        $(`#player-${player.id}`).remove();
    })

    players.forEach(function (player) {
        let playerContantainer =
            `<div id="player-${player.id}">
                <div id="player_name_${player.id}" class="player-name">${player.name}</div>
                <div id="player_wallet_${player.id}" class="player-wallet">$${player.wallet}</div>
                <div id="player_jail_card_${player.id}" class="player-jail-card">Has free Jail Card?</div>
                <div class="player-list-of-properties">List of properties</div>
                <ul id=player_properties_${player.id}></ul>
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
            // DO NOTHING
        } else {
            console.error("Something went wrong")
        }

        if (player.jailCard) {
            $(`#player_jail_card_${player.id}`).append(` Yes.`);
        } else {
            $(`#player_jail_card_${player.id}`).append(` No.`);
        }

        $(`#player-${player.id}`).append(`<button id="quit_player_${player.id}" class="player-quit-game">Quit game</button>`)
    });

    $(`#player_name_${currentPlayer.id}`).addClass(`player-${currentPlayer.color}-turn`);

    // BUTTON QUIT GAME
    $(".player-quit-game").click(function (event) {
        let quitPlayerId = parseInt(event.target.id.slice(12, 13));
        players[quitPlayerId].quitGame();
        // CURRENT PLAYER QUITTED
        if (currentPlayer.id === quitPlayerId) {
            currentPlayer.endTurn();
            diceResult = [];
            updateDiceDisplay();
            currentTurnStatus.playerHasRolled = false;
            currentTurnStatus.playerHasMoved = false;
            currentTurnStatus.playerHasFinished = false;
            newTurn();
        }
        $(`#player-${quitPlayerId}`).remove();
        updateAllBoard();
        let playersRemaining = players.filter(player => player.stillPlaying === true);
        if (playersRemaining.length === 1) {
            endGame();
        }
        updateLocalStorage();
    });
}

const createTokens = () => {
    $(".token").remove();
    for (let player of players.filter(player => player.stillPlaying === true)) {
        let token = document.createElement("span");
        token.id = "token-player-" + player.id;
        token.classList.add("token", "token-color-player-" + tokenColors[player.id]);
        if (player.inJail === true) {
            token.classList.add("token-in-jail");
        }
        document.getElementById("token-holder-0").append(token);
    }
}

/*------ VALIDATE PLAYER CAN AFFORD ------*/
const playerCanAfford = (player, amount) => { // (OBJECT, NUMBER)
    if (player.wallet >= amount) {
        return true;
    } else {
        message(`Sorry, <span class="player-${player.color}-turn">${player.name}</span>, you can't afford this.`);
        return false;
    }
}

/*------ VALIDATE HOUSE BUY & SELL ------*/
const checkAllOwnersTheSame = (property) => { // OBJECT
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
        if (property.mortage === true) {
            canBuy = false;
        }
    }
    return canBuy;
}

const checkPropertyCanSellHouse = (property) => { // (OBJECT)
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

/*------ PERFORM HOUSE BUY & SELL ------*/
const buyHouse = (property) => {
    if (playerCanAfford(players[property.owner], property.housePrice)) {
        property.house += 1;
        players[property.owner].transaction(-property.housePrice);
        updateAllBoard();
    }
}

const sellHouse = (property) => {
    property.house -= 1;
    players[property.owner].transaction(property.housePrice / 2);
    updateAllBoard();
}

/*------ MORTAGE ------*/
const setMortage = (property) => {
    players[property.owner].transaction(property.mortageValue);
    property.mortage = true;
    createDeedCard(property);
    updateAllBoard();
}
const liftMortage = (property) => {
    players[property.owner].transaction(-(Math.round(property.mortageValue * 1.10)));
    property.mortage = false;
    createDeedCard(property);
    updateAllBoard();
}

const removeSellPropertyDisplay = () => {
    $(".sell-property-container").remove();
}

/*------ CALCULATE RENT ------*/
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
        // REGULAR PROPERTY
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
                if (checkAllOwnersTheSame(property)) {
                    return property.baseRent * 2;
                } else {
                    return property.baseRent;
                }
        }
    }
};


/*------ UPDATE BOARD ------*/
const updateExtraTurn = () => {
    if (currentPlayer.throwDoubles === 1) {
        $(`#extra-turn`).html(`EXTRA TURN`);
    } else if (currentPlayer.throwDoubles === 2) {
        $(`#extra-turn`).html(`EXTRA TURN x2`);
    } else {
        $(`#extra-turn`).html(``);
    }
}

const updateHousesAndMortageDisplay = () => {
    for (property of arrayOfProperties()) {
        if (property.mortage === true) {
            if (property.id === 5 || property.id === 12 || property.id === 15 || property.id === 25 || property.id === 28 || property.id === 35) {
                $(`#square-${property.id}`).find(".mortage-sign").remove();
                $(`#square-${property.id}`).prepend(`<p class="mortage-sign">M</p>`);
            } else {
                $(`#square-${property.id}`).find(".mortage-sign").remove();
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
}

const updateSquaresDisplay = () => {
    for (property of arrayOfProperties()) {
        for (player of players) {
            $(`#square-${property.id}`).removeClass(`property-of-player-${player.color}`);
        }
        if (property.owner !== undefined) {
            $(`#square-${property.id}`).addClass(`property-of-player-${players[property.owner].color}`);
        } else if (property.owner === undefined) {}
    }
    updateHousesAndMortageDisplay();
}

const updatePlayersContainers = () => {
    players.forEach(function (player) {
        if (player.stillPlaying === true) {
            $(`#player_wallet_${player.id}`).html(`$${players[player.id].wallet}`);
            $(`#player_jail_card_${player.id}`).html(`Has free Jail Card?`);
            if (player.jailCard) {
                $(`#player_jail_card_${player.id}`).append(` Yes.`);
            } else {
                $(`#player_jail_card_${player.id}`).append(` No.`);
            }
            $(`#player_name_${player.id}`).removeClass(`player-${player.color}-turn`);
            $(`#player_properties_${player.id}`).empty();
            let filteredProperties = arrayOfProperties().filter(property => property.owner === player.id);
            for (let property of filteredProperties) {
                $(`#player_properties_${property.owner}`).prepend(`<li>${property.name}</li>`);
            }
        }
    });
    $(`#player_name_${currentPlayer.id}`).addClass(`player-${currentPlayer.color}-turn`);
};

const updateDiceDisplay = () => {
    if (diceResult.length !== 0) {
        document.getElementById(`dice_1`).src = `media/dice-${diceResult[0]}.svg`;
        document.getElementById(`dice_2`).src = `media/dice-${diceResult[1]}.svg`;
    } else {
        document.getElementById(`dice_1`).src = `media/dice-0.png`;
        document.getElementById(`dice_2`).src = `media/dice-0.png`;
    }
}

const updateTokens = (player) => {
    let token = $(`#token-player-${player.id}`);
    token.remove();
    $(`#token-holder-${player.position}`).append(token);
}

const updateAllBoard = () => {
    updateSquaresDisplay();
    updatePlayersContainers();
    updateExtraTurn();
    updateDiceDisplay();
}

/*------ CONTINUE CURRENT TURN ------*/
const continueTurn = () => {
    if (currentPlayer.stillPlaying === false) {
        currentPlayer.endTurn();
    }
    if (currentTurnStatus.playerHasRolled === false) {
        newTurn();
    } else if (currentTurnStatus.playerHasRolled === true && currentTurnStatus.playerHasMoved === false) {
        playerRolledDices();
    } else if (currentTurnStatus.playerHasMoved === true && currentTurnStatus.playerHasFinished === false) {
        playerMoved();
    } else if (currentTurnStatus.playerHasFinished === true) {
        playerCompletedTurn();
    } else {
        console.error("Something went wrong!");
    }

    if (currentTurnStatus.gameEnded === true) {
        endGame();
    }
}

/*------ END OF THE GAME ------*/

$("#button_end_game").click(function () {
    endGame();
});

const checkPlayerNoMoney = () => {
    players.forEach(function (player) {
        if (player.wallet < 0) {
            hideAllConsoleButtons();
            message(`<span class="player-${player.color}-turn">${player.name}</span> run out of money. Set mortages or sell properties, hotels or houses to continue the game. Or you can quit the game.`);
        }
    })
}

const endGame = () => {
    currentTurnStatus.gameEnded = true;
    updateLocalStorage();
    // DISPLAY PARTIAL RESULTS
    $("body").prepend(`
    <div class="game-results-container">
        <div class="game-results">
            <p class="game-results__title">The game ended. Thanks for playing Virtual Monopoly!</p>
            <p class="game-results__paragraph">When the game finished, players had:</p>
        </div>
    </div>`);

    players.forEach(function (player) {
        $(".game-results").append(`<div class="results-players-container" id="partial-result-player-${player.id}"></div>`)
        if (player.stillPlaying === true) {
            $(`#partial-result-player-${player.id}`).append(`<p><span class="player-${player.color}-turn">${player.name}</span> finished with:</p>
            <ul id="partial-result-player-${player.id}-list" class="partial-results-list">
                <li>$${player.wallet} in his/her wallet.</li>
            </ul>
            `);
        } else {
            $(`#partial-result-player-${player.id}`).append(`<p><span class="player-${player.color}-turn">${player.name}</span> had quitted the game.</p>`);
        }
    });

    arrayOfProperties().forEach(function (property) {
        if (property.owner !== undefined) {
            $(`#partial-result-player-${property.owner}-list`).append(`<li id="property-${property.id}-final-display">${property.name}</li>`);

            if (property.mortage == true) {
                $(`#property-${property.id}-final-display`).append(`<span> (was mortaged).<span>`)
            } else {
                $(`#property-${property.id}-final-display`).append(`<span>.<span>`)
            }

            if (property.house === 0) {
                // DO NOTHING
            } else if (property.house > 0 && property.house < 5) {
                $(`#property-${property.id}-final-display`).append(`<span> This property had ${property.house} house/s.<span>`);
            } else if (property.house === 5) {
                $(`#property-${property.id}-final-display`).append(`<span> This property had 4 houses and a hotel.<span>`);
            } else {
                console.error("Something went wrong");
            }
        }
    });

    // DISPLAY FINAL RESULTS
    $(".game-results").append(`
    <div id="display_final_results">
        <p class="game-results__paragraph">After lifting up the mortages and selling the houses, hotels and properties, the results are:</p>
    </div>`);

    arrayOfProperties().forEach(function (property) {
        if (property.owner !== undefined) {

            if (property.mortage == true) {
                liftMortage(property);
            }

            while (property.house > 0) {
                sellHouse(property);
            }

            players[property.owner].transaction(property.price);
            property.owner = undefined;
        }
    })

    players.sort((a, b) => {
        return b.wallet - a.wallet;
    });

    players.forEach(function (player) {
        if (player.stillPlaying === true) {
            $("#display_final_results").append(`<p class="results-players-container"><span class="player-${player.color}-turn">${player.name}</span> finished with a total of $${player.wallet}.</p>`)
        }
    })

    $(".game-results").append(`<button class="button-play-again" id="button_restart_game">Play again!</button>`);
    document.getElementById("button_restart_game").addEventListener("click", function () {
        localStorage.clear();
        console.log("Local Storage is clear");
        location.reload();
    });
}

const checkTotalHousesAndHotel = (player) => {
    let propertiesOfPlayer = squares.filter(property => property.owner === player.id);
    let counterHouses = 0;
    let counterHotels = 0;
    for (property of propertiesOfPlayer) {
        if (property.house > 1 && property.house < 5) {
            counterHouses += property.house;
        } else if (property.house === 5) {
            counterHotels += 1;
        }
    }
    return counterHouses * 40 + counterHotels * 125;
}

/*------ LOCAL STORAGE ------*/
const updateLocalStorage = () => {
    localStorage.setItem("allPlayersIds", JSON.stringify(allPlayersIds));
    localStorage.setItem("currentPlayerId", JSON.stringify(currentPlayerId));
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    localStorage.setItem("currentSquareId", JSON.stringify(currentSquare.id));
    localStorage.setItem("diceResult", JSON.stringify(diceResult));
    localStorage.setItem("consoleMessages", JSON.stringify(consoleMessages));
    localStorage.setItem("squares", JSON.stringify(squares));
    localStorage.setItem("currentTurnStatus", JSON.stringify(currentTurnStatus));
    localStorage.setItem("chestCardsOrder", JSON.stringify(chestCardsOrder));
    localStorage.setItem("chanceCardsOrder", JSON.stringify(chanceCardsOrder));
    localStorage.setItem("selectedCard", JSON.stringify(selectedCard));
    localStorage.setItem("comesFromCard", JSON.stringify(comesFromCard));
    console.log("Local Storage was updated.");
}

const retrieveLocalStorage = () => {
    // PLAYERS ARRAY
    players = [];
    let string_of_players = JSON.parse(localStorage.getItem("players"));
    string_of_players.forEach(player => {
        players.push(new Player(player.id, player.stillPlaying, player.name, player.color, player.position, player.wallet, player.throwDoubles, player.anotherTurn, player.inJail, player.jailCard));
    });
    squares = JSON.parse(localStorage.getItem("squares"));
    // INITIAL GAMEPLAY
    currentPlayerId = JSON.parse(localStorage.getItem("currentPlayerId"));
    currentPlayer = players[currentPlayerId];
    currentSquare = squares[JSON.parse(localStorage.getItem("currentSquareId"))];
    diceResult = JSON.parse(localStorage.getItem("diceResult"));
    currentTurnStatus = JSON.parse(localStorage.getItem("currentTurnStatus"));
    allPlayersIds = JSON.parse(localStorage.getItem("allPlayersIds"));
    chestCardsOrder = JSON.parse(localStorage.getItem("chestCardsOrder"));
    chanceCardsOrder = JSON.parse(localStorage.getItem("chanceCardsOrder"));
    selectedCard = JSON.parse(localStorage.getItem("selectedCard"));
    comesFromCard = JSON.parse(localStorage.getItem("comesFromCard"));
    console.log("Local Storage was retrieved.");
}