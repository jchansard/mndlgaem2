/**
 * playerdeck.js
 *
 * the player's decks: their hand, draw, and discard piles
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

 // constructor; don't use directly. use playercardsbuilder.
Game.PlayerCards = function(draw, hand, discard, properties, eventEmitter) {
	properties = properties || {};
	this._draw    = draw;
	this._hand    = hand;
	this._discard = discard;

	this._handLimit = properties.handLimit || 5; 

	this._emitter = eventEmitter;
}

// factory
Game.PlayerCardsBuilder = {
	build: function(properties, eventEmitter) {
		// create draw, hand, and discard decks
		var fakecard = new Game.Card({ power: 3, cdr: 2 });
		var fakecard2 = new Game.Card({ power: 5, cdr: 4});
		var handlist = [fakecard, fakecard, fakecard, fakecard, fakecard];
		var drawlist = [fakecard2, fakecard2, fakecard2, fakecard2, fakecard2, fakecard2, fakecard2];
		var draw    = new Game.Deck(drawlist,'draw');
		var hand    = new Game.Deck(handlist,'hand');
		var discard = new Game.Deck(null,'discard');

		var cards = new Game.PlayerCards(draw, hand, discard, properties, eventEmitter);
		cards.initListeners();
		return cards;
	}
}
Game.Utils.extendPrototype(Game.PlayerCards, {

	// event listeners
	initListeners: function()
	{
		var e = this._emitter;
		var drawCardsHandler = this.drawCards.bind(this);
		var discardHandHandler = this.discardHand.bind(this);
		var drawNewHandHandler = this.drawNewHand.bind(this);

		e.Event('drawCards').subscribe(drawCardsHandler);
		e.Event('discardHand').subscribe(discardHandHandler);
		e.Event('drawNewHand').subscribe(drawNewHandHandler);
	},

	// publishes deck change event to all decks that are passed
	_publishDeckChange: function()
	{
		var e = this._emitter;
		for (var i = 0; i < arguments.length; i++)
		{
			e.Event(arguments[i].id, "deckChange").publish();
		}
	},

	// get a deck based on id
	get: function(id)
	{
		return (this['_' + id] !== undefined) ? this['_' + id] : null;
	},

	// draw cards from the player's draw pile and add them to the player's hand
	drawCards: function(numCardsToDraw, deckToDrawFrom, deckToDrawTo)
	{
		numCardsToDraw = numCardsToDraw || 1;
		deckToDrawFrom = deckToDrawFrom || this._draw;
		deckToDrawTo   = deckToDrawTo   || this._hand;	

		while (numCardsToDraw > 0)
		{
			this._drawCard(0, deckToDrawFrom, deckToDrawTo);
			numCardsToDraw--;
		}

		this._publishDeckChange(deckToDrawFrom, deckToDrawTo);
	},

	// draw a new hand
	drawNewHand: function()
	{
		var draw = this._draw;
		var hand = this._hand;
		this.drawCards(this._handLimit, draw, hand);

		this._publishDeckChange(hand, draw);
	},

	// discard entire hand
	discardHand: function()
	{
		var hand = this._hand;
		var discard = this._discard;

		hand.addTo(discard);

		this._publishDeckChange(hand, discard);
	},

	_drawCard: function(cardToDrawIndex, deckToDrawFrom, deckToDrawTo) 
	{
		cardToDrawIndex = cardToDrawIndex || 0;
		deckToDrawFrom = deckToDrawFrom   || this._draw;
		deckToDrawTo   = deckToDrawTo     || this._hand;

		if (deckToDrawFrom.length() <= 0)
		{
			this._shuffleDiscardIntoDraw();
		}

		var drawnCard = deckToDrawFrom.draw(cardToDrawIndex);
		deckToDrawTo.add(drawnCard);
	},

	// shuffles discard pile into draw pile
	_shuffleDiscardIntoDraw: function() 
	{
		this._discard.shuffle();
		this._discard.addTo(this._draw);
	},
});