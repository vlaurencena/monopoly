let selectedCard = [];

let chest_cards_order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let chance_cards_order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// FUNCTION TO SHUFFLE ARRAYS
const shuffle = (array) => {

    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

// SHUFFLE CARDS ARRAYS
shuffle(chest_cards_order);

shuffle(chance_cards_order);

// PICK UP CARD
random_chance_card = () => {
    let card = chance_cards_order.shift(); // TAKE THE FIRST CARD ID
    selectedCard = chanceCards[card]; // SELECT THE CARD
    chance_cards_order.push(card); // PUSH IT TO THE END
}

random_chest_card = () => {
    let card = chest_cards_order.shift();
    selectedCard = chanceCards[card];
    chest_cards_order.push(card);
}

const chanceCards = [{
        "id": 0,
        "text": "GET OUT OF JAIL FREE. This card may be kept until needed or traded.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].jailCard = true;

        }
    },
    {
        "id": 1,
        "text": "Make General Repairs on All Your Property. For each house pay $25. For each hotel $100.",
        "action": function () {
            console.log(this.text);
            // TO DO

        }
    },
    {
        "id": 2,
        "text": "Speeding fine $15.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(-15);

        }
    },
    {
        "id": 3,
        "text": "You have been elected chairman of the board. Pay each player $50.",
        "action": function () {
            console.log(this.text);
            let filteredArray = players.filter(function (player) {
                return player.id !== currentPlayerId;
            });
            filteredArray.forEach(player => player.transaction(50));
            players[currentPlayerId].transaction(filteredArray.length * -50);

        }
    },
    {
        "id": 4,
        "text": "Go back three spaces.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].move(-3);

        }
    },
    {
        "id": 5,
        "text": "ADVANCE TO THE NEAREST UTILITY. IF UNOWNED, you may buy it from the Bank. IF OWNED, throw dice and pay owner a total ten times the amount thrown.",
        "action": function () {
            console.log(this.text);
            // TO DO 

        }
    },
    {
        "id": 6,
        "text": "Bank pays you dividend of $50.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(50);
        }
    },
    {
        "id": 7,
        "text": "ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.",
        "action": function () {

            console.log(this.text);
            // TODO

        }
    },
    {
        "id": 8,
        "text": "Pay poor tax of $15.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(15);
        }
    },
    {
        "id": 9,
        "text": "Take a trip to Reading Rail Road. If you pass \"GO\" collect $200.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(50);

            // TO DO
        }
    },
    {
        "id": 10,
        "text": "ADVANCE to Boardwalk.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].jump(39);
        }
    },
    {
        "id": 11,
        "text": "ADVANCE to Illinois Avenue. If you pass \"GO\" collect $200.",
        "action": function () {
            console.log(this.text);

            // TO DO

        }
    },
    {
        "id": 12,
        "text": "Your building loan matures. Collect $150.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(150);
        }
    },
    {
        "id": 13,
        "text": "ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.",
        "action": function () {
            console.log(this.text);

            // TO DO

        }
    },
    {
        "id": 14,
        "text": "ADVANCE to St. Charles Place. If you pass \"GO\" collect $200.",
        "action": function () {
            console.log(this.text);

            // TO DO

        }
    },
    {
        "id": 15,
        "text": "Go to Jail. Go Directly to Jail. Do not pass \"GO\". Do not collect $200.",
        "action": function () {
            currentPlayer.goToJail();
        }
    }
]

const communityChestCards = [{
        "id": 0,
        "text": "Get out of Jail, for free. This card may be kept until needed or sold.",
        "action": function () {
            currentPlayer.jailCard = true;
        }
    },
    {
        "id": 1,
        "text": "You have won second prize in a beauty contest. Collect $10.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(10);
        }
    },
    {
        "id": 2,
        "text": "From sale of stock, you get $50.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(50);
        }
    },
    {
        "id": 3,
        "text": "Life insurance matures. Collect $100.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(100);
        }
    },
    {
        "id": 4,
        "text": "Income tax refund. Collect $20.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(20);
        }
    },
    {
        "id": 5,
        "text": "Holiday fund matures. Receive $100.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(100);
        }
    },
    {
        "id": 6,
        "text": "You inherit $100.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(100);
        }
    },
    {
        "id": 7,
        "text": "Receive $25 consultancy fee.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(25);
        }
    },
    {
        "id": 8,
        "text": "Pay hospital fees of $100.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(100);
        }
    },
    {
        "id": 9,
        "text": "Bank error in your favor. Collect $200.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(200);
        }
    },
    {
        "id": 10,
        "text": "Pay school fees of $50.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(-50);
        }
    },
    {
        "id": 11,
        "text": "Doctor's fee. Pay $50.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].transaction(-50);
        }
    },
    {
        "id": 12,
        "text": "It is your birthday. Collect $10 from every player.",
        "action": function () {
            console.log(this.text);
            let filteredArray = players.filter(function (player) {
                return player.id !== currentPlayerId;
            });
            filteredArray.forEach(player => player.transaction(-10));
            players[currentPlayerId].transaction(filteredArray.length * 10);
        }
    },
    {
        "id": 13,
        "text": "Advance to \"GO\" (Collect $200).",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].jump(0);
            players[currentPlayerId].transaction(200);
        }
    }, {
        "id": 14,
        "text": "You are assessed for street repairs. $40 per house. $115 per hotel.",
        "action": function () {
            console.log(this.text);

            // TO DO

        }
    }, {
        "id": 15,
        "text": "Go to Jail. Go directly to Jail. Do not pass \"GO\". Do not collect $200.",
        "action": function () {
            console.log(this.text);
            players[currentPlayerId].jump(10);
        }
    }
]