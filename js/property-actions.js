// EVENT LISTENER TO PROPERTY SQUARES

for (let id of propertiesIds) {
    $(`#square-${id}`).click(function () {
        let getId = this.id.split("-")[1];
        let selectedProperty = squares[getId];
        createDeedCard(selectedProperty);
    });
}
// CREATE DEED CARD
const clearDeedContainer = () => {
    document.getElementById(`title-deed-container`).innerHTML = ``;
}

let createDeedCard = (property) => { // OBJECT
    clearDeedContainer();

    if (property.id === 12 || property.id === 28) {
        let utilityImgSubstring;
        property.name.includes("Electric") ? utilityImgSubstring = "electric-company" : utilityImgSubstring = "water-works";
        // UTILITY
        document.getElementById(`title-deed-container`).innerHTML =
            `<div id="property_${property.id}" 
            <div class="title-deed">
                <img class="title-deed-img" src="media/${utilityImgSubstring}-icon.svg">
                <div class="title-deed__header">${property.name.toUpperCase()}</div>
                <div class="title-deed__utility-descripton">
                    <div>If one "Utility" is owned rent is 4 times amount shown on dice.</div>
                    <div>If both "Utilities are owned rent is 10 times amount shown on dice.</div>
                </div>
            </div>
            <ul class="title-deed-options">
                <li id="title-deed-close">Close</li>
                <li id="title-deed-set-mortage">Set mortage</li>
                <li id="title-deed-lift-mortage">Lift mortage</li>
                <li id="title-deed-sell-property">Sell property</li>
            </ul>
        </div>`
        $("#title-deed-buy-house").hide();
        $("#title-deed-sell-house").hide();
    } else if (property.id === 5 || property.id === 15 || property.id === 25 || property.id === 35) {
        // RAIL ROAD
        document.getElementById(`title-deed-container`).innerHTML =

            `<div id="property_${property}" 
        
            <div class="title-deed">
            <img class="title-deed-img" src="media/train-icon.svg">
                    <div class="title-deed__info">
                    <div class="title-deed__header">${property.name.toUpperCase()}</div>
                        <div>RENT $25</div>
                        <div class="title-deed__houses-prices">
                            <div>If 2 R.R.'s are owned</div>
                            <div>$50</div>
                            <div>If 3 R.R.'s are owned</div>
                            <div>$100</div>
                            <div>If 4 R.R.'s are owned</div>
                            <div>$200</div>
                        </div>
                        <div>Mortage Value $${property.mortageValue}</div>
                    </div>            
            </div>

            <ul class="title-deed-options">
                <li id="title-deed-close">Close</li>
                <li id="title-deed-set-mortage">Set mortage</li>
                <li id="title-deed-lift-mortage">Lift mortage</li>
                <li id="title-deed-sell-property">Sell property</li>
            </ul>

        </div>`
        $("#title-deed-buy-house").hide();
        $("#title-deed-sell-house").hide();
    } else {
        // REGULAR PROPERTY
        document.getElementById(`title-deed-container`).innerHTML =

            `<div id="property_${property}" 
        
            <div class="title-deed">

                <div class="title-deed__header color-${property.groupColor}">${property.name.toUpperCase()}</div>
                    <div class="title-deed__info">
                        <div>RENT $${property.baseRent}</div>
                        <div class="title-deed__houses-prices">
                            <div>With 1 House</div>
                            <div>$${property.rent1}</div>
                            <div>With 2 Houses</div>
                            <div>$${property.rent2}</div>
                            <div>With 3 Houses</div>
                            <div>$${property.rent3}</div>
                            <div>With 4 Houses</div>
                            <div>$${property.rent4}</div>
                        </div>
                        <div>With HOTEL $${property.rent5}</div>
                        <div>Mortage Value $${property.mortageValue}</div>
                        <div>Houses Cost $${property.housePrice} each</div>
                        <div>Hoteles, $${property.housePrice}, plus 4 Houses</div>
                    </div>
                <div class="title-deed__bottom-line">If player owns ALL the Lots of any Color Group, the rent is
                Doubled on Uninproved Lots in that
                group.</div>
            
            </div>

            <ul class="title-deed-options">
                <li><button id="title-deed-close">Close</button></li>
                <li><button id="title-deed-set-mortage">Set mortage</button></li>
                <li><button id="title-deed-lift-mortage">Lift mortage</button></li>
                <li><button id="title-deed-sell-property">Sell property</button></li>
                <li><button id="title-deed-buy-house">Buy House</button></li>
                <li><button id="title-deed-sell-house">Sell House</button></li>
            </ul>

        </div>`
    }

    // TITLE DEED OPTIONS
    $("#title-deed-buy-house").hide();
    $("#title-deed-sell-house").hide();
    $("#title-deed-sell-property").hide();
    $("#title-deed-set-mortage").hide();
    $("#title-deed-lift-mortage").hide();

    $(`#title-deed-close`).click(function () {
        clearDeedContainer();
    });
    $(".title-deed-options").on("click", function () {
        checkPlayerNoMoney();
    });

    if (property.owner !== undefined && property.house === 0) {
        $(`#title-deed-sell-property`).show().click(function () {
            sellPropertyDisplay(property);
        });

        if (property.mortage === false) {
            $("#title-deed-set-mortage").show().click(function () {
                setMortage(property);
                console.log("aquí")
            });

        } else if (property.mortage === true) {
            $(`#title-deed-sell-property`).hide();
            $("#title-deed-lift-mortage").show().click(function () {
                liftMortage(property);
            });
        } else {
            console.error("Something wen wrong with property.mortage");
        }

    }

    if (checkAllOwnersTheSame(property)) {
        if (checkPropertyCanBuyHouse(property)) {
            $(`#title-deed-buy-house`).show().click(function () {
                buyHouse(property);
                createDeedCard(property);
            });
        }

        if (checkPropertyCanSellHouse(property)) {
            $(`#title-deed-sell-house`).show().click(function () {
                sellHouse(property);
                createDeedCard(property);
            });
        }
    }
    if (property.house === 4) {
        $(`#title-deed-buy-house`).html("Buy hotel");
    } else if (property.house === 5) {
        $(`#title-deed-sell-house`).html("Sell hotel");
    }
}

// SELL PROPERTY

let sellPropertyDisplay = (property) => {
    let filteredArray = players.filter(function (player) {
        return player.id !== property.owner;
    });

    $(".board").append(`
    <div class="sell-property-container">
    <div class="sell-property-popup">
        <p class="sell-property-title">${players[property.owner].name}, do you want to sell ${property.name}?</p>
        <p>Who are you selling it to?<p>
        <form class="sell-property-buyer">
        </form>
    
    </div>
    </div>`);

    for (let player of filteredArray) {
        $(".sell-property-buyer").append(
            `<input type="radio" id="player_${player.id}_wants_to_buy" name="buyer" value="${player.id}" required>
             <label for="value-${player.id}">${player.name}</label><br>`
        )
    }

    $(".sell-property-buyer").append(`
        <label for="amount">How much will he or she pay?:</label>
        <input type="number" id="sale_amount" name="sale-amount" min="0" required>
        <input id="confirm_sale" type="submit" value="Sell property">`)


    $("#confirm_sale").click(function (event) {  
        let transactionInfo = $(".sell-property-buyer").serializeArray();
        message(`Sorry, you need to set a value higher than $0.`)
        players[property.owner].transaction(parseInt(transactionInfo[1].value));
        console.log(transactionInfo[1].value);
        property.owner = parseInt(transactionInfo[0].value);
        players[property.owner].transaction(parseInt(-transactionInfo[1].value));
        console.log(property.owner);
        updateAllBoard();
        removeSellPropertyDisplay();
    })

    $(".sell-property-popup").append(`<div id="close-sell-property-container">Close</div>`);

    $("#close-sell-property-container").click(function () {
        removeSellPropertyDisplay();
    });
}