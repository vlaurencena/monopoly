class Player {
    constructor(id, stillPlaying, name, color, position, wallet, throwDoubles, anotherTurn, inJail, jailCard) {
        this.id = id;
        this.stillPlaying = stillPlaying;
        this.name = name;
        this.color = color;
        this.position = position;
        this.wallet = wallet;
        this.throwDoubles = throwDoubles;
        this.anotherTurn = anotherTurn;
        this.inJail = inJail;
        this.jailCard = jailCard;
    }

    rollDices() {
        let randomDice = getDicesResult();
        let dice1 = randomDice[0];
        let dice2 = randomDice[1];
        animateDices(dice1, dice2);
        
        if (dice1 === dice2) {
            //  THROW DOUBLES
            this.throwDoubles++;
            this.anotherTurn = true;

            if (this.inJail === true) {
                this.throwDoubles = 0;
                this.anotherTurn = false;
            }

            if (this.throwDoubles === 3) {
                //  THROW DOUBLES X3
                message(`<span class="player-${this.color}-turn">${this.name}</span>throwDoubles for the third time, go to Jail!`);
                this.goToJail();
                this.throwDoubles = 0;
                this.anotherTurn = false; 
            }
        } else {
            //  NOT THROW DOUBLES
            this.throwDoubles = 0;
            this.anotherTurn = false;
        }
        return randomDice;
    }

    move(positions) {
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
            }, i * moveTokenAnimation);
        }

        // FINAL SETUP

        this.position = newPosition;
        if (completedRound) {
            this.position -= 40;
            currentSquare = squares[this.position];
            message(`<span class="player-${this.color}-turn">${this.name}</span> completed the round. Here are your $200.`);
            this.transaction(200);
        } else {
            currentSquare = squares[this.position];
            message(`<span class="player-${this.color}-turn">${this.name}</span> is on position ${this.position}.`);
        }

    }

    jump(newPosition) {
        this.position = newPosition;
        currentSquare = squares[this.position];
        updateTokens(this);
    }

    transaction(signAndAmount, displayMessage = true) {
        this.wallet += signAndAmount;
        if (displayMessage) {
            if (signAndAmount < 0) {
                message(`<span class="player-${this.color}-turn">${this.name}</span> paid $${-signAndAmount}, and now has $${this.wallet} in his/her wallet.`);
            } else if (signAndAmount > 0){
                message(`<span class="player-${this.color}-turn">${this.name}</span> received $${signAndAmount}, and now has $${this.wallet} in his/her wallet`);
            }
        }
        updatePlayersContainers();
    }

    buyProperty(property) {
        this.wallet -= property.price;
        property.owner = this.id;
        message(`Congratulations, <span class="player-${this.color}-turn">${this.name}</span>, you  just bought ${property.name} for $${property.price}. Now you have $${this.wallet} in your wallet.`);
    }

    goToJail() {
        document.getElementById(`token-player-${this.id}`).classList.add("token-in-jail");
        this.jump(10);
        this.inJail = true;
    }

    getOutOfJail() {
        document.getElementById(`token-player-${this.id}`).classList.remove("token-in-jail");
        this.inJail = false;
    }

    quitGame() {
        let propertiesOfThisOwner = arrayOfProperties().filter(property => property.owner === this.id);
        for (let property of propertiesOfThisOwner) {
            property.owner = undefined;
        }
        this.stillPlaying = false;
        $(`#token-player-${this.id}`).remove();
        this.wallet = 0;
        message(`<p><span class="player-${this.color}-turn">${this.name}</span> quitted the game.</p>`)
    }

    endTurn() {

        if (this.anotherTurn === true) { // PLAYER GOT DOUBLES
            this.anotherTurn = false;
        } else if (this.anotherTurn === false) { // PLAYER DIDN'T GET DOUBLES

            if (this.id === allPlayersIds.length - 1) {
                currentPlayerId = 0
                currentPlayer = players[currentPlayerId];
                currentSquare = squares[currentPlayer.position];

            } else {
                currentPlayerId = currentPlayerId + 1;
                currentPlayer = players[currentPlayerId];
                currentSquare = squares[currentPlayer.position];
            }

            if (currentPlayer.stillPlaying === false) {
                currentPlayer.endTurn();
            }

        } else {
            console.error(`Something went wrong`);
        }
        updateDiceDisplay();
    }
}