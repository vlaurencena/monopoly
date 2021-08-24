/*---------------------- CONSTRUCTORS ----------------------*/

class Player {
    constructor(id, name, tokenColor, position, diceResult, wallet, anotherTurn, throwDoubles, jailCard) {
        this.id = id;
        this.name = name;
        this.tokenColor = tokenColor;
        this.position = position;
        this.diceResult = diceResult;
        this.wallet = wallet;
        this.anotherTurn = anotherTurn;
        this.throwDoubles = throwDoubles;
        this.jailCard = jailCard;
    }

    rollDices() {
        let dice1 = Math.ceil(Math.random() * 6);
        let dice2 = Math.ceil(Math.random() * 6);
        console.log(`${this.name} got ${dice1} and ${dice2}. Total = ${dice1 + dice2}.`);

        if (dice1 === dice2) {
            this.throwDoubles++;
            this.anotherTurn = true;
            console.log(`${this.name} throwDoubles is = ${this.throwDoubles}`);
        }

        if (this.throwDoubles === 3) {
            this.jump(10);
        }

        return dice1 + dice2;
    }

    move(positions) {
        console.log(`${this.name} was on square ${this.position}`);
        this.position = this.position + positions;
        console.log(`${this.name} moved to ${this.position}`);
        // FINISH ROUND
        if (currentPlayer.position >= 40) {
            currentPlayer.position -= 40;
            console.log(`${this.name} completed the round, and now is in ${this.position}.`)
            this.transacion(200);
        }
        // CHANCE
        if (currentPlayer.position === 7 || currentPlayer.position === 22 || currentPlayer.position === 36) {
            chance();
        }
         // COMMUNITY CHEST
        if (currentPlayer.position === 2 || currentPlayer.position === 17 || currentPlayer.position === 33) {
            communityChest();
        }
    }

    jump(newPosition) {
        this.position = newPosition;
    }

    transaction(signAndAmount) {
        this.wallet += signAndAmount;
        if (signAndAmount < 0) {
            console.log(`${this.name} paided ${-signAndAmount}, and now has ${this.wallet} in his/her wallet`);
        } else {
            console.log(`${this.name} received ${signAndAmount}, and now has ${this.wallet} in his/her wallet`);
        }
    }

    buy(propertyName, propertyValue) {
        this.wallet = this.wallet - propertyValue;
        alert(`Congratulations, you have just bought ${propertyName}. Now you have $${this.wallet} on your wallet`);
        squares[this.position].owner = currentPlayerId;
        console.log(squares[this.position]);
    }

    endTurn() {
        if (this.anotherTurn === true) {

            this.anotherTurn = false;

        } else if (this.anotherTurn === false) {

            this.throwDoubles = 0;

            if (this.id === allPlayersIds.length - 1) {

                currentPlayerId = 0;

            } else {

                currentPlayerId = currentPlayerId + 1;

            }

            currentPlayer = players[currentPlayerId];

            console.log(`Now it's ${currentPlayer.name} turn.`);

        } else {

            console.error(`Something went wrong`);

        }
    }
}


/*---------------------- INITIAL SETUP ----------------------*/

const initialMoney = 1500;
const tokenColors = ["red", "blue", "orange", "skin"];

/*---------------------- PLAYER'S SETUP ----------------------*/

const players = [];

const allPlayersIds = [];

let currentPlayerId = 0;


// REAL VERSION

let numberOfPlayer = parseInt(prompt(`Choose number of players from 2-4?`));

for (i = 0; i < numberOfPlayer; i++) {
    let playerName = prompt(`Whats the name of player ${i+1}`);
    players.push(new Player(i, playerName, tokenColors[i], 0, undefined, initialMoney, false, 0, false));

}

// FAST VERSION FOR DEVELOPMENT

// for (i = 0; i < 4; i++) {
//     players.push(new Player(i, `Player${i}`, tokenColors[i], 0, undefined, initialMoney, false, 0, false));
//     allPlayersIds.push(i);
// }

/* GAME PLAY */

let currentPlayer = players[currentPlayerId];

console.log(`Welcome, now it's ${currentPlayer.name}'s turn.`);

button_rollDice = () => {
    currentPlayer.diceResult = currentPlayer.rollDices();
}

button_move = () => {
    currentPlayer.move(currentPlayer.diceResult);
}

button_buy = () => {
    let currentProperty = squares[currentPlayer.position];
    currentPlayer.buy(currentProperty.name, currentProperty.price);
}

button_endTurn = () => {
    currentPlayer.endTurn();
}

chance = () => {
    let randomNumber = Math.ceil(Math.random() * chanceCards.length);
    chanceCards[randomNumber].action();
}

communityChest = () => {
    let randomNumber = Math.ceil(Math.random() * communityChestCards.length);
    communityChestCards[randomNumber].action();
}

currentPlayerListOfProperties = () => {
    console.log(squares.filter(property => property.owner === currentPlayer.id));
}