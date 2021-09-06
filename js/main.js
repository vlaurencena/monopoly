/*---------------------- BOARD CONFIGURACION ----------------------*/


add_event_to_property = () => {

    for (var i = 0; i < arrayOfProperties.length; i++) {

        document.getElementById(`property_${i}`).addEventListener("click", function () {
            console.log("sip");
        })
    }
}




/*---------------------- INITIAL GAMEPLAY SETUP ----------------------*/

let currentPlayerId = 0; // NEEDS CONSTANT UPDATE
let currentPlayer = players[currentPlayerId]; // NEEDS CONSTANT UPDATE
let currentSquare = squares[currentPlayer.position]; // NEEDS CONSTANT UPDATE
let diceResult = [];

/*------ CONTROL PANNEL BUTTONS ------*/

const button_roll_dice = document.getElementById("button_roll_dice");
const button_move = document.getElementById("button_move");
const button_buy = document.getElementById("button_buy");
const button_end_turn = document.getElementById("button_end_turn");
const button_pay = document.getElementById("button_pay");
const button_use_jail_card = document.getElementById("button_use_jail_card");
const button_pick_up_card = document.getElementById("button_pick_up_card");
const button_ok = document.getElementById("button_ok");

hide_element = (element) => {
    element.style.display = "none";
}

show_element = (element) => {
    element.style.display = "block";
}

hide_all_buttons = () => {
    hide_element(button_roll_dice);
    hide_element(button_move);
    hide_element(button_buy);
    hide_element(button_end_turn);
    hide_element(button_pay);
    hide_element(button_use_jail_card);
    hide_element(button_pick_up_card);
    hide_element(button_ok);
}

update_player_info = () => {
    for (let i = 0; i < allPlayersIds.length; i++) {
        document.getElementById(`player_wallet_${i}`).innerHTML = `$${players[i].wallet}`;
        document.getElementById(`player_properties_${i}`).innerHTML = `${players[i].propertiesOwn}`;
    }
}

/*---------------------- GAME PLAY ----------------------*/

/*------ STEP 1 ------*/
new_turn = () => {

    document.getElementById(`player_name_${currentPlayerId}`).classList.add(`player-${currentPlayer.color}-turn`);

    console.log(`its ${currentPlayer.name} turn`);

    hide_all_buttons();

    /*------ IS IN JAIL? ------*/


    if (currentPlayer.isInJail) {

        /*--- IS IN JAIL ---*/

        console.log(`You are in jail. (currentPlayer.isInJail = ${currentPlayer.isInJail}`);

        /*-SHOW BUTTON PAY-*/

        show_element(button_pay);
        button_pay.addEventListener("click", function () {

            currentPlayer.transaction(-50);

            new_turn();

        }, {
            once: true
        });


        /*-SHOW BUTTON ROLL-*/

        show_element(button_roll_dice);
        button_roll_dice.addEventListener("click", function () {
            currentPlayer.rollDices();

            /*------ ROLLED DOUBLES? ------*/

            if (currentPlayer.throwDoubles) {

                /*--- YES ---*/

                console.log(`You throw doubles. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
                currentPlayer.getOutOfJail();
                player_completed_turn();

            } else {
                /*--- NO ---*/

                console.log(`No doubles, you lost turn. (currentPlayer.ThrowDoubles = ${currentPlayer.throwDoubles}`);
                currentPlayer.endTurn();
                player_completed_turn();
            }

        }, {
            once: true
        });

        /*------ HAS JAIL CARD? ------*/

        if (currentPlayer.jailCard) {

            /*--- YES JAIL CARD ---*/

            /*-SHOW BUTTON USE JAIL CARD-*/

            console.log(`You have jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);
            show_element(button_use_jail_card);
            button_use_jail_card.addEventListener("click", function () {
                +

                currentPlayer.getOutOfJail();
                new_turn();

                console.log(`You used your jail card. (currentPlayer.JailCard = ${currentPlayer.jailCard}`);



            }, {
                once: true
            });

        } else {

            /*--- NO JAIL CARD ---*/

            console.log(`You don't have jail card`);
        }
        /*--- IS NOT IN JAIL ---*/

    } else {

        console.log("not in jail");

        show_element(button_roll_dice);
        show_element(button_roll_dice);
        button_roll_dice.addEventListener("click", function () {
            diceResult = currentPlayer.rollDices();
            console.log(diceResult);
            player_rolled_dices();
        }, {
            once: true
        });

    }
}

/*------ STEP 2 ------*/

player_rolled_dices = () => {

    /*- HIDE ALL BUTTONS -*/
    hide_all_buttons();
    /*--------------------*/

    show_element(button_move);
    button_move.addEventListener("click", function () {
        currentPlayer.move(diceResult[2]);
        diceResult = [];
        player_moved();
    }, {
        once: true
    });

}



/*------ STEP 3 ------*/
player_moved = () => {

    /*- HIDE ALL BUTTONS -*/
    hide_all_buttons();


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /*------ IS IN CHEST? ------*/

    if (currentPlayer.position === 2 || currentPlayer.position === 17 || currentPlayer.position === 33) {

        console.log(`current player is in chest`);

        show_element(button_pick_up_card);
        button_pick_up_card.addEventListener("click", function () {
            random_chest_card();
            hide_element(button_pick_up_card);
        }, {
            once: true
        });

        show_element(button_ok);
        button_ok.addEventListener("click", function () {
            selectedCard.action();
            selectedCard = [];
            player_completed_turn();
        }, {
            once: true
        });

        /*------ IS IN CHANCE? ------*/
    } else if (currentPlayer.position === 7 || currentPlayer.position === 22 || currentPlayer.position === 36) {

        console.log(`current player is in chance`);

        show_element(button_pick_up_card);
        button_pick_up_card.addEventListener("click", function () {
            random_chance_card();
            console.log(selectedCard.text);
            hide_element(button_pick_up_card);
        }, {
            once: true
        });

        show_element(button_ok);
        button_ok.addEventListener("click", function () {
            selectedCard.action();
            selectedCard = [];
            player_completed_turn();
        }, {
            once: true
        });

        /*------ IS IN JUST VISITIN OF FREE PARKING? ------*/
    } else if (currentPlayer.position === 10 || currentPlayer.position === 20) {

        console.log(`current player is in just visiting or free parking`);


        /*------ IS IN INCOME TAX? ------*/
    } else if (currentPlayer.position === 4) {

        currentPlayer.transaction(-200);



        /*------ IS ON PROPERTY ------*/
    } else {
        console.log(`current player is in on property`);
    }

}


/*------ STEP 4 ------*/
player_completed_turn = () => {

    /*- HIDE ALL BUTTONS -*/
    hide_all_buttons();
    /*--------------------*/

    show_element(button_end_turn);
    button_end_turn.addEventListener("click", function () {
        document.getElementById(`player_name_${currentPlayerId}`).classList.remove(`player-${currentPlayer.color}-turn`);
        currentPlayer.endTurn();
        new_turn();
    }, {
        once: true
    });


}