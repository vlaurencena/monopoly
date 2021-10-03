$(".open-rules-monopoly ").click(function () {
    $("main").append(rules);
    $(".rules-container").show();
    $("#button_close_rules").click(function () {
        $(".rules-container").remove();
    });
});

const rules =
    `<div class="rules-container">
        <p class="rules-title">How Do You Play Virtual Monopoly?</p>
        <p>The rules of Virtual Monopoly are not difficult, but they are specific. Virtual Monopoly can be played by 2 to 4 players.</p>
        <p>Each player has a token and starts on ‘GO’, and they all start with $250, $1500 or $3000, depending on the game mode selected.</p>
        <p class="rules-subtitle">Game Play</p>
        <p>There are 4 main parts to a turn:</p>
        <ol>
            <li><strong>Roll the dice:</strong> Move the number of squares indicated. If you throw doubles, you take another turn
                after your turn is completed. Each time you pass ‘Go’, collect $200.</li>
            <li><strong>Buy properties:</strong> You may buy any property that you land on if it is not already owned.</li>
            <li><strong>Building:</strong> You may only build when you own all properties in a color group. Building must be equal on
                all properties in a group. You may place a single building on a single property, but you may not
                place two buildings on one property unless all other properties in the group have one building
                present (even build rule). Any property can have a total of 4 houses, except Utilities and
                Railroads, which cannot be devloped. To place a hotel on a property, 4 houses must be present on all
                properties in the group. Houses are removed from the property when a hotel is placed.</li>
            <li><strong>Complete necessary actions:</strong> Pay rent as determined by the Title Deed for the property you are on.
                Pay Income Tax to the Bank ($200). Draw a Community Chest or Chance card
                and press "OK" to follow the instructions.</li>
        </ol>
        <p class="rules-subtitle">Going to Jail</p>
        <p>In the rules of Virtual Monopoly, there are 3 ways to be sent to ‘Jail’:</p>
        <ul>
            <li>Land on a space marked ‘Go to Jail’.</li>
            <li>Draw a card marked ‘Go to Jail’.</li>
            <li>Roll doubles three times in a row.</li>
        </ul>
        <p>There are 4 ways to get out of ‘Jail’</p>
        <ul>
            <li>Pay the $50 fine before rolling the dice.</li>
            <li>Use a ‘Get Out Of Jail Free Card’ before rolling the dice.</li>
            <li>Roll doubles.</li>
        </ul>
        <p>When you get out of ‘Jail’, move the number of spaces indicated by the dice. Even while in ‘Jail’, you
            may buy and sell property and collect any rent owed to you. You are not sent to ‘Jail’ if you land on
            the ‘Jail’ square during normal game play, and you do not incur a fine.</p>
        <p class="rules-subtitle">Money to Pay Rent and more</p>
        <p>The rules of Virtual Monopoly state, if you do not have enough money to pay Rent or other obligations during your
            turn, you may chose to sell houses, hotels, or property. Buildings may be sold for one-half
            of the purchase price. Buildings may not be sold to other players. Unimproved properties (including
            railroad and utilities) can be sold to any player for any amount.</p>
        <p>Unimproved properties can also be mortgaged to the Bank for the value mortgage value printed on the Title
            Deed. No rent is collected on mortgaged properties. To lift a mortgage, the player must pay the Bank the
            mortgage amount plus 10% interest. Players retain possession of mortgaged properties. If that player
            chooses, he or she may sell the mortgaged property to another player for any price. The property would
            remain mortgaged, and the new owner would have to pay the Bank the same mortgage + 10% to lift the
            mortgage.</p>
        <p class="rules-subtitle">Winning the Game</p>
        <p>You may chose to end the game at any time and tally the total worth of each player (including buildings
            and all property worth). You may also chose to play until all but one player has been declared Bankrupt.
            Bankruptcy occurs when a player owes more than he or she can pay. Any player who has declared Bankruptcy is no longer part of the game and all his/her properties will have no owner. According to the rules of Virtual Monopoly, the last player in the game, or the player with the most money, wins.</p>
        <button id="button_close_rules">GO BACK</button>
    </div>`;