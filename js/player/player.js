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
	this._cards  = cards;
	this._skills = []; 
	this.id      = 'player';
}
Game.Player.extend(Game.Entity);

Game.PlayerBuilder = {
	build: function(eventEmitter) {
		var properties =
		{
			handLimit: 5
		}
		var cards = Game.PlayerCardsBuilder.build(properties, eventEmitter);
		var player = new Game.Player(eventEmitter, cards);
	
		player.init();

		return player;
	}
}

Game.Utils.extendPrototype(Game.Player, {

	init: function()
	{
		this._initListeners();
		this._initSkills();
	},

	_initListeners: function() 
	{
		var e = this._emitter;
		var playerMoveHandler = this.handleMove.bind(this);

		e.Event(this.id,'move').subscribe(playerMoveHandler);
	},

	_initSkills: function()
	{
		this._skills = [];
		this._skills.push(new Game.Skill(Game.Skill.PlayerAttack, this, this._emitter));
	},

	getDeck: function(id)
	{
		return this._cards.get(id);
	},

	getSkills: function()
	{
		return this._skills;
	},

	// draw cards from the player's draw pile and add them to the player's hand
	drawCards: function(numCardsToDraw, deckToDrawFrom, deckToDrawTo)
	{
		this._emitter.Event('drawCards').publish(numCardsToDraw, deckToDrawFrom, deckToDrawTo);
	},

	// draw cards up to the player's hand limit
	drawNewHand: function()
	{
		this._emitter.Event('drawNewHand').publish();
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
	},

	position: function() {
		return [this._x, this._y];
	}

});