/**
 * deck.js
 *
 * an array of Game.Cards, with the top of the deck at the 0 element
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Deck = function(cardList) {
	this._cardList = cardList || [];
};


Game.Utils.extendPrototype(Game.Deck, {
	// add a card to the deck	
	add: function(card) 
	{
		this._cardList.push(card);
	},

	// "draw" a card from the deck; if no index is passed,
	// draw the top card. returns the drawn card.
	draw: function(cardIndex)
	{
		if (cardIndex === undefined) {
			return this._cardList.shift();
		} else {
			return this._cardList.splice(cardIndex, 1);
		}
	},

	// "shuffles" the cardlist
	shuffle: function() 
	{
		this._cardList = this._cardList.randomize();
	},

	// empties the deck
	empty: function() 
	{
		this._cardList = [];
	},

	// empties deck into another
	addTo: function(targetDeck) 
	{
		this._cardList.forEach(function(card) {
			targetDeck.add(this.draw());
		}, this);
	},

	length: function() 
	{
		return this._cardList.length;
	}
});