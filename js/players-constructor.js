class Player {
    constructor(id, name, tokenColor, position, wallet, propertiesOwn, throwDoubles, anotherTurn, isInJail, jailCard) {
        this.id = id;
        this.name = name;
        this.tokenColor = tokenColor;
        this.position = position;
        this.wallet = wallet;
        this.propertiesOwn = propertiesOwn;
        this.throwDoubles = throwDoubles;
        this.anotherTurn = anotherTurn;
        this.isInJail = isInJail;
        this.jailCard = jailCard;
    }

    rollDices() {

        let dice1 = Math.ceil(Math.random() * 6);

        let dice2 = Math.ceil(Math.random() * 6);

        console.log(`${this.name} got ${dice1} and ${dice2}. Total = ${dice1 + dice2}.`);

        if (dice1 === dice2) {
            this.throwDoubles++;
            this.anotherTurn = true;
            console.log(`${this.name} throwDoubles is = ${this.throwDoubles}, and has another turn.`);
        }

        if (this.throwDoubles === 3) {
            console.log(`${this.name} throwDoubles for the third time, go to Jail!`)
            this.jump(10);
        }

        return dice1 + dice2;
    }

    move(positions) {

        console.log(`${this.name} was on square ${this.position}`);

        this.position = this.position + positions;

        // CHECK IF ROUND IS FINISHED
        if (this.position >= 40) {
            this.position -= 40;
            console.log(`${this.name} completed the round, and now is in ${this.position}.`)
            this.transaction(200);
        }

        document.getElementById(`token-holder-${this.position}`).appendChild(document.getElementById(`token-player-${this.id}`));

        console.log(`${this.name} moved to ${this.position}`);
    }

    jump(newPosition) {

        this.position = newPosition;

        currentSquare = players[currentPlayerId].position;
    }


    transaction(signAndAmount) {
        this.wallet += signAndAmount;
        if (signAndAmount < 0) {
            console.log(`${this.name} paided ${-signAndAmount}, and now has ${this.wallet} in his/her wallet`);
        } else {
            console.log(`${this.name} received ${signAndAmount}, and now has ${this.wallet} in his/her wallet`);
        }
    }

    buy(property) {

        this.wallet -= property.price;

        document.querySelector(`#player_wallet_${this.id}`).innerHTML =
            `$${this.wallet}`;

        alert(`Congratulations, you have just bought ${property.name}. Now you have $${this.wallet} on your wallet`);

        property.owner = this.id;

        document.querySelector(`#square-${property.id}`).classList.add(`property-of-player-${currentPlayer.tokenColor}`);

        this.propertiesOwn.push(property);

        document.querySelector(`#player_properties_${this.id}`).innerHTML =
            document.querySelector(`#player_properties_${this.id}`).innerHTML +=
            `<li>${property.name}</li>`
    }

    goToJail() {
        document.getElementById(`token-player-${this.id}`).classList.add("token-in-jail");
        this.position = 10;
        this.isInJail = true;
    }

    getOutOfJail() {
        document.getElementById(`token-player-${this.id}`).classList.remove("token-in-jail");
        this.isInJail = false;
    }

    endTurn() {

        if (this.anotherTurn === true) { // PLAYER GOT DOUBLES

            this.anotherTurn = false;

        } else if (this.anotherTurn === false) { // PLAYER DIDN'T GET DOUBLES

            this.throwDoubles = 0;

            if (this.id === allPlayersIds.length - 1) {

                currentPlayerId = 0;

            } else {

                currentPlayerId = currentPlayerId + 1;
                currentPlayer = players[currentPlayerId];
                currentSquare = currentPlayer.position;

            }

            console.log(`Now it's ${players[currentPlayerId].name} turn.`);

        } else {

            console.error(`Something went wrong`);

        }
    }
}