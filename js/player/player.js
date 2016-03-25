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
		var useSkillHandler   = this.useSkill.bind(this);

		e.Event(this.id,'move').subscribe(playerMoveHandler);
		e.Event(this.id,'useSkill').subscribe(useSkillHandler);
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

	// calculate skill effects based on selected cards, then use skill and draw new hand
	useSkill: function(skillCallback)
	{
		var selectedCards   = [];
		var unselectedCards = [];
		var effects;

		// get selected and unselected cards and calculate effects 
		this._emitter.Event('getSelection').publish('hand', selectedCards, unselectedCards);
		effects = this.calculateCardEffects(selectedCards);
		
		// use skill
		skillCallback(effects);

		// calculate effects of unselected cards and draw new hand
		this.handleUnselectedCards(unselectedCards);
		this.drawNewHand();
	},

	calculateCardEffects: function(cards)
	{
		var effects = {
			power: 0
		};
		cards.forEach(function(card) {
			effects.power += card.power;
		});

		return effects;
	},

	handleUnselectedCards: function(cards)
	{

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
	}

});