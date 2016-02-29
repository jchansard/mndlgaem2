/**
 * player.js
 *
 * contains player info: skills, player deck, entity info, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Player = function(eventEmitter, cards) {
	Game.Entity.call(this, { 
		glyph: ['@', 'white'],
		x: 1,
		y: 1
	}, eventEmitter)
	this._cards = cards;
}
Game.Player.extend(Game.Entity);

Game.PlayerBuilder = {
	build: function(eventEmitter) {
		var cards = Game.PlayerCardsBuilder.build(eventEmitter);
		var player = new Game.Player(eventEmitter, cards);
	
		player.initListeners();

		return player;
	}
}

Game.Utils.extendPrototype(Game.Player, {

	initListeners: function() 
	{
		var e = this._emitter;
		var playerMoveHandler = this.handleMove.bind(this);

		e.Event('player-move').subscribe(playerMoveHandler);
	},

	// draw cards from the player's draw pile and add them to the player's hand
	drawCards: function(numCardsToDraw, deckToDrawFrom, deckToDrawTo)
	{
		this._emitter.Event('drawCards').publish(numCardsToDraw, deckToDrawFrom, deckToDrawTo);
	},

	// discard entire hand
	discardHand: function()
	{
		this._emitter.Event('discardHand').publish();
	},

	handleMove: function(direction) {
		switch (direction) {
			case 'up'   : this.moveUp(); break;
			case 'down' : this.moveDown(); break;
			case 'left' : this.moveLeft(); break;
			case 'right': this.moveRight(); break;
		}
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