class Player {
    constructor(id, name, color, position, wallet, propertiesOwn, throwDoubles, anotherTurn, inJail, jailCard) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.position = position;
        this.wallet = wallet;
        this.propertiesOwn = propertiesOwn;
        this.throwDoubles = throwDoubles;
        this.anotherTurn = anotherTurn;
        this.inJail = inJail;
        this.jailCard = jailCard;
    }

    rollDices() {

        //  ROLL DICE
        let dice1 = Math.ceil(Math.random() * 6);
        let dice2 = Math.ceil(Math.random() * 6);



        //  ANIMATE DICE IMAGES
        document.getElementById(`dice_1`).classList.add("animation");
        document.getElementById(`dice_2`).classList.add("animation");

        // for (let i = 0; i <= 10; i++) {
        //     let random_dice = `dice-${Math.ceil(Math.random() * 6)}`;

        //     setTimeout(() => {
        //         document.getElementById(`dice_1`).src = `../media/${random_dice}.svg`;
        //         document.getElementById(`dice_2`).src = `../media/${random_dice}.svg`;
        //     }, i * 500);
        // }

        //  CHANGE DICE IMAGES
        document.getElementById(`dice_1`).src = `../media/dice-${dice1}.svg`;
        document.getElementById(`dice_2`).src = `../media/dice-${dice2}.svg`;

        //  THROW DOUBLES
        if (dice1 === dice2) {

            this.throwDoubles++;
            this.anotherTurn = true;
            document.getElementById(`extra-turn`).innerHTML = `EXTRA TURN`;

            if (this.throwDoubles === 2) {

                document.getElementById(`extra-turn-amount`).innerHTML = ` x2`;

            } else if (this.throwDoubles === 3) {

                console.log(`${this.name} throwDoubles for the third time, go to Jail!`);
                this.goToJail();

            } else {

                this.throwDoubles = 0;
                this.anotherTurn = false;

            }

        }
        //RETURN
        return [dice1, dice2, dice1 + dice2];

    }

    move(positions) {

        // INITIAL SETUP

        let completedRound = false;

        // ANIMATION

        let oldPosition = this.position;
        let newPosition = this.position + positions;
        let positionsMoved = newPosition - oldPosition;

        for (let i = 0; i <= positionsMoved; i++) {
            let transition = i + oldPosition;

            // CHECK IF ROUND IS FINISHED
            if (transition >= 40) {
                transition -= 40;

                if (completedRound === false) {
                    completedRound = true;
                }
            }

            setTimeout(() => {
                document.getElementById(`token-holder-${transition}`).appendChild(document.getElementById(`token-player-${this.id}`));
            }, i * 300);

        }

        // FINAL SETUP

        this.position = newPosition;

        if (completedRound) {
            this.position -= 40;
            currentSquare = squares[this.position];
            console.log(`${this.name} completed the round. Here are your $200.`);
            this.transaction(200);
        } else {
            currentSquare = squares[this.position];
            console.log(`player${this.name} is on position ${this.position}`);
        }

        
    }


    jump(newPosition) {
        this.position = newPosition;
        document.getElementById(`token-holder-${this.position}`).appendChild(document.getElementById(`token-player-${this.id}`));
        currentSquare = squares[this.position]
    }


    transaction(signAndAmount) {

        this.wallet += signAndAmount;

        if (signAndAmount < 0) {
            console.log(`${this.name} paided ${-signAndAmount}, and now has ${this.wallet} in his/her wallet`);
        } else {
            console.log(`${this.name} received ${signAndAmount}, and now has ${this.wallet} in his/her wallet`);
        }
        update_player_info();
    }

    //     buy(property) {

    //         this.wallet -= property.price;

    //         document.querySelector(`#player_wallet_${this.id}`).innerHTML =
    //             `$${this.wallet}`;

    //         alert(`Congratulations, you have just bought ${property.name}. Now you have $${this.wallet} on your wallet`);

    //         property.owner = this.id;

    //         document.querySelector(`#square-${property.id}`).classList.add(`property-of-player-${currentPlayer.tokenColor}`);

    //         this.propertiesOwn.push(property);



    //         update_player_info();
    //     }

    goToJail() {
        document.getElementById(`token-player-${this.id}`).classList.add("token-in-jail");
        this.jump(10);
        this.inJail = true;
    }

    getOutOfJail() {
        document.getElementById(`token-player-${this.id}`).classList.remove("token-in-jail");
        this.isInJail = false;
    }

    endTurn() {

        if (this.anotherTurn === true) { // PLAYER GOT DOUBLES

            this.anotherTurn = false;

        } else if (this.anotherTurn === false) { // PLAYER DIDN'T GET DOUBLES

            document.getElementById(`extra-turn-amount`).innerHTML = ``;
            document.getElementById(`extra-turn`).innerHTML = ``;

            if (this.id === allPlayersIds.length - 1) {

                currentPlayerId = 0;

            } else {

                currentPlayerId = currentPlayerId + 1;
                currentPlayer = players[currentPlayerId];
                currentSquare = currentPlayer.position;
            }


        } else {

            console.error(`Something went wrong`);

        }

        document.getElementById(`dice_1`).src = `../media/dice-0.png`;
        document.getElementById(`dice_2`).src = `../media/dice-0.png`;
        document.getElementById(`dice_1`).classList.remove("animation");
        document.getElementById(`dice_2`).classList.remove("animation");
    }
}