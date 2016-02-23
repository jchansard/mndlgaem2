/**
 * player.js
 *
 * contains player info: skills, player deck, entity info, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Player = function() {
	Game.Entity.call(this, { 
		glyph: ['@', 'white'],
		x: 1,
		y: 1
	})
	// a player has three "decks" -- draw, discard, and hand
	this._hand    = new Game.Deck();
	this._discard = new Game.Deck();
	this._draw	  = new Game.Deck();
}
Game.Player.extend(Game.Entity);
Game.Utils.extendPrototype(Game.Player, {

	// draw cards from the player's draw pile and add them to the player's hand
	drawCards: function(numCardsToDraw, deckToDrawFrom, deckToDrawTo)
	{
		numCardsToDraw = numCardsToDraw || 1;
		deckToDrawFrom = deckToDrawFrom   || this._draw;
		deckToDrawTo   = deckToDrawTo     || this._hand;	
		
		while (numCardsToDraw > 0)
		{
			this._drawCard(0, deckToDrawFrom, deckToDrawTo);
			numCardsToDraw--;
		}
	},

	_drawCard: function(cardToDrawIndex, deckToDrawFrom, deckToDrawTo) 
	{
		cardToDrawIndex = cardToDrawIndex || 0;
		deckToDrawFrom = deckToDrawFrom   || this._draw;
		deckToDrawTo   = deckToDrawTo     || this._hand;

		if (deckToDrawFrom.length() <= 0)
		{
			this.shuffleDiscardIntoDraw();
		}

		var drawnCard = deckToDrawFrom.draw(cardToDrawIndex);
		deckToDrawTo.add(drawnCard);
	},

	// shuffles discard pile into draw pile
	shuffleDiscardIntoDraw: function() 
	{
		this._discard.shuffle();
		this._discard.addTo(this._draw);
	},

	moveUp:    function() {
		this.tryMove(this._x, this._y - 1);
	},
	moveDown:  function() {
		this.tryMove(this._x, this._y + 1);
	},
	moveLeft:  function() {
		this.tryMove(this._x - 1, this._y);
	},
	moveRight: function() {
		this.tryMove(this._x + 1, this._y);
	}

});