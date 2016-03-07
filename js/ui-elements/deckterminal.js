/**
 * deckterminal.js
 *
 * container for card ui elements; displays all cards in a Deck (e.g. player's hand, discard pile)
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

Game.UIElements.DeckTerminal = function(properties, gui, eventEmitter)
{
	properties  = properties || {};
	Game.UIElements.UIElement.apply(this, arguments);
	this._deck  = properties.deck;
	this._numCards = properties.numCards || 5;
	this._cards = new Array(this._numCards);
}

Game.UIElements.DeckTerminal.extend(Game.UIElements.UIElement);
Game.Utils.extendPrototype(Game.UIElements.DeckTerminal, {

	build: function(drawArea) 
	{
		Game.UIElements.UIElement.prototype.build.apply(this, arguments)
		var numCards = this._numCards;
		for (var i = 0; i < numCards; i++)
		{
			this.setCard(i, this._deck.get(i));
		}
	},

	init: function() 
	{
		this._initListeners();
	},

	// listen for deckChange for this terminal's deck
	_initListeners: function() 
	{
		var e 	  = this._emitter;
		var topic = this._deck.id;
		e.Event(topic,'deckChange').subscribe(this.redrawDeck)
	},

	// when the deck changes, call this to update gui
	redrawDeck: function()
	{
		for (var i = 0; i < numCards; i++)
		{
			this.setCard(i, this._deck.get(i));
		}
	},

	// update housed card's card to draw
	setCard: function(index, card)
	{
		if (this._cards[index] === undefined)
		{
			var newCard = {
				size:
				{
					height: 5,
					width: 4
				},
				position: 
				{
					x: 1 + index * 4, // todo: dont hardcode
					y: 1
				},
				layer: 1
			};
			this._cards[index] = this._gui.addElement(Game.UIElements.Card, newCard, this.drawArea);
		}
		this._cards[index].boundCard = card;
	},

	// draw the dialog; override this for different dialog types
	render: function() 
	{
		Game.DrawUtils.drawBorder(this._gui, this.position, this.size);// FIX OVERLAY
	},	

	// get input events for this dialog
	getInputEvents: function() 
	{
		var deck = this._deck;
		var inputEvents = {

		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) 
	{
		// TODO: set focus on click
		return;
	},
});