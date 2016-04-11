/**
 * deckterminal.js
 *
 * container for card ui elements; displays all cards in a Deck (e.g. player's hand, discard pile)
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const UIElement = require('./uielement');
const Card   = require('./card');
const util   = require('util');
const extend = require('../util/extend.js');

var DeckTerminal = function(properties, gui, eventEmitter)
{
	properties  = properties || {};
	UIElement.apply(this, arguments);
	this.type = 'DeckTerminal';
	this._deck  = properties.deck;
	this._numCards = properties.numCards || 5;
	this._cards = new Array(this._numCards);
}

util.inherits(DeckTerminal, UIElement);

extend(DeckTerminal, {

	build: function(drawArea, id) 
	{
		UIElement.prototype.build.apply(this, arguments)
		var numCards = this._numCards;
		for (var i = 0; i < numCards; i++)
		{
			this._setCard(i, this._deck.get(i));
		}
		this._initListeners();
	},

	// listen for deckChange for this terminal's deck
	_initListeners: function() 
	{
		var e = this._emitter;
		var topic = this._deck.id;
		this._events = [[topic, 'deckchange', this.redrawDeck.bind(this)]]
		e.subscribeEnMasse(this._events);
	},

	// when the deck changes, call this to update gui
	redrawDeck: function()
	{
		for (var i = 0; i < this._numCards; i++)
		{
			this._setCard(i, this._deck.get(i));
		}
	},

	// update housed card's card to draw
	_setCard: function(index, card)
	{
		if (this._cards[index] === undefined)
		{
			var newCard = {
				size: {	height: 8, width: 7	},
				position: {	x: 1 + index * 7, y: 1 },
				layer: 1
			};
			var cardElement = {};
			this._emitter.Event(this._gui, 'addElement').publish(Card, newCard, this.drawArea, cardElement)
			this._cards[index] = cardElement.data;
		}
		this._cards[index].boundCard = card;
	},

	// draw the dialog; override this for different dialog types
	render: function(drawCallback) 
	{
		var drawInfo = 
		{
			type: 'border',
			size: this.size
		}
		drawCallback(this.position.x, this.position.y, drawInfo);// FIX OVERLAY
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

module.exports = DeckTerminal;