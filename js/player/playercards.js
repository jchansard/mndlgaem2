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
Game.PlayerCards = function(draw, hand, discard, eventEmitter) {
	this._draw    = draw;
	this._hand    = hand;
	this._discard = discard;
	this._emitter = eventEmitter;
}

// factory
Game.PlayerCardsBuilder = {
	build: function(eventEmitter) {
		// create draw, hand, and discard decks
		var fakecard = new Game.Card({ power: 3, cdr: 2 });
		var handlist = [fakecard, fakecard, fakecard, fakecard, fakecard];
		var draw    = new Game.Deck(null,'draw');
		var hand    = new Game.Deck(handlist,'hand');
		var discard = new Game.Deck(null,'discard');

		var cards = new Game.PlayerCards(draw, hand, discard, eventEmitter);
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

		e.Event('drawCards').subscribe(drawCardsHandler);
		e.Event('discardHand').subscribe(discardHandHandler);
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
	},

	// discard entire hand
	discardHand: function()
	{
		this._hand.addTo(this._discard);
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