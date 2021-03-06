/**
 * deck.js
 *
 * an array of Game.Cards, with the top of the deck at the 0 element
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
var Deck = function(cardList,id) {
	this._cardList = cardList || [];
	this._selected = [];
	this.id        = id;
};

const extend = require('../util/extend.js')

extend(Deck, {
	// add a card to the deck	
	add: function(card) 
	{
		this._cardList.push(card);
	},

	// gets a card from the deck without modifying it; returns undefined if out of range
	get: function(index)
	{
		if ((index < 0) || index > this._cardList.length) 
		{
			return undefined;
		}
		return this._cardList[index];
	},

	// "draw" a card from the deck; if no index is passed,
	// draw the top card. returns the drawn card.
	draw: function(cardIndex)
	{
		if (cardIndex === undefined) {
			return this._cardList.shift();
		} else {
			return this._cardList.splice(cardIndex, 1)[0];
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
		return this._cardList.splice(0);
	},

	// empties deck into another
	addTo: function(targetDeck) 
	{

		while (this._cardList.length > 0)
		{
			targetDeck.add(this.draw());
		}
	},

	// sets specified card as "selected", e.g. if player selects card to play
	select: function(index)
	{
		var indexInSelected = this._selected.indexOf(index);
		if (indexInSelected === -1)
		{
			this._selected.push(index);
		} 
		else
		{
			this._selected.splice(indexInSelected, 1);
		}
	},

	// returns true if the specified card is selected, else false
	isSelected: function(index)
	{
		return this._cardList[index].selected;
	},

	// returns all selected cards and empties _selected
	confirmSelection: function() 
	{
		return this._selected.splice(0);
	},

	// returns all selected and unselected cards via passed arrays
	// TODO: this is borked
	getSelection: function(selected, unselected)
	{
		this._cardList.forEach(function(card)
		{
			var clone = require('../util/cloneobject');
			var deckToAddTo = (card.selected) ? selected : unselected;
			if (deckToAddTo) { deckToAddTo.push(card.info()); }
			// card.select(false);
		});
	},

	// returns length of _cardList
	length: function() 
	{
		return this._cardList.length;
	}
});

module.exports = Deck;