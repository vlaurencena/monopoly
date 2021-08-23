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
        console.log(`${currentPlayer.name} got ${dice1} and ${dice2}. Total = ${dice1 + dice2}.`);

        if (dice1 === dice2) {
            this.throwDoubles++;
            this.anotherTurn = true;
            console.log(`${currentPlayer.name} throwDoubles is = ${this.throwDoubles}`);
        }

        if (this.throwDoubles === 3) {
            this.jump(10);
        }

        return dice1 + dice2;
    }

    move(positions) {
        console.log(`${currentPlayer.name} was on square ${currentPlayer.position}`);
        this.position = this.position + positions;
        console.log(`${currentPlayer.name} moved to ${currentPlayer.position}`);

        if (currentPlayer.position >= 40) {
            currentPlayer.position -= 40;
            console.log(`${currentPlayer.name} completed the round, and now is in ${currentPlayer.position}.`)
            this.transacion(200);
        }
    }

    jump(newPosition) {
        this.position = newPosition;
    }

    transacion(signAndAmount) {
        this.wallet += signAndAmount;
        console.log(`${currentPlayer.name} has ${currentPlayer.wallet} in his/her wallet`);
    }

    buy(propertyName, propertyValue) {
        this.wallet = this.wallet - propertyValue;
        alert(`Congratulations, you have just bought ${propertyName}. Now you have $${this.wallet} on your wallet`);
        squares[currentPlayer.position].owner = currentPlayerId;
        console.log(squares[currentPlayer.position]);
    }

    endTurn() {
        if (currentPlayer.anotherTurn === true) {

            currentPlayer.anotherTurn = false;

        } else if (currentPlayer.anotherTurn === false) {

            currentPlayer.throwDoubles = 0;

            if (currentPlayerId === allPlayersIds.length - 1) {

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
    allPlayersIds.push(i);
}

// FAST VERSION FOR DEVELOPMENT

// for (i = 0; i < 4; i++) {
//     players.push(new Player(i, `Player${i}`, tokenColors[i], 0, undefined, initialMoney, false, 0, false));
//     allPlayersIds.push(i);
// }

let currentPlayer = players[currentPlayerId];

console.log(players);

/* GAME PLAY */

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

currentPlayerListOfProperties = () => {
    console.log(squares.filter(property => property.owner === currentPlayer.id));
}
