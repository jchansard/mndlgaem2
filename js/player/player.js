/**
 * player.js
 *
 * contains player info: skills, player deck, entity info, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const Entity = require('../entities/entity.js');
const Skill  = require('../entities/skill.js');
const Skills = require('../entities/skills.js')
const util   = require('util');
const extend = require('../util/extend.js');
const rsvp   = require('rsvp');

var Player = function(eventEmitter, gui, cards) {
	Entity.call(this, { 
		glyph: ['@', 'white'],
		x: 1,
		y: 1
	}, eventEmitter, gui)
	this._cards  = cards;
	this._skills = []; 
	this.id      = 'player';
}

util.inherits(Player, Entity)

extend(Player, {

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
		this._skills.push(new Skill(Skills.PlayerAttack));
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
	useSkill: function(skill)
	{
		var selectedCards   = [];
		var unselectedCards = [];
		var choices = [];
		var targets = [];
		var position = this.position();
		var promiseGetTargetChoice = this._promiseGetTargetChoice.bind(this);
		var useSkillWithTargets = this._useSkillWithTargets.bind(this);
		var effects;

		// get selected and unselected cards and calculate effects 
		this._emitter.Event('getSelection').publish('hand', selectedCards, unselectedCards);
		effects = this.calculateCardEffects(selectedCards);

		// create a promise for each skill effect that requires targeting
		var skillPromises = skill.effects.map(function(effect, index) {
			var targeting = skill.targeting[index];
			var filter  = targeting.targetFilter;
			var choices = targeting.targetChoices(position);
			return promiseGetTargetChoice(choices, filter);
		});

		// get targets then use skill on targets
		rsvp.all(skillPromises).then(function(targetsChosen) {
			targets = targetsChosen.slice();
			return new rsvp.resolve(targets);
		  }).then(function(targets) { useSkillWithTargets(skill, effects, targets) });

		// calculate effects of unselected cards and draw new hand
		this.handleUnselectedCards(unselectedCards);
		this.drawNewHand();

	},

	_promiseUseSkill: function(effect, index) 
	{	
		var targets = [];
		skill.effects.forEach(function(effect, index) {
			var targeting = skill.targeting[index];
			var choices = targeting.targetChoices(this.position());
			this._promiseGetTargetChoice(choices, targeting.targetFilter, targets)
				.then(this._promiseGetTargets(targets))
		}.bind(this));
	},

	_promiseGetTargetChoice: function(targetTiles, targetFilter, targetEntities) 
	{
		var e = this._emitter;
		var gui = this._gui;
		return new rsvp.Promise(function(resolve, reject) 
		{
			var Targeting = require('../ui-elements').Targeting;
			var targetingUI = {
				choices: targetTiles,
				filter: targetFilter,
				callback: resolve 
			};
			e.Event(gui, 'addElement').publish(Targeting, targetingUI, 'mapterminal');
		});
	},

    _promiseGetTargets: function() 
    {
		return function(targetsFound) {
			targetEntities.push(targetsFound);
			return new rsvp.Promise(function(resolve, reject)
			{
				targetEntities.forEach(function(target) {
					resolve(effects, target)
				})
			}); 
		}
	},

	_getSkillTargets: function()
	{

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

var build = function(eventEmitter, gui) {
	var properties =
	{
		handLimit: 5
	}
	var PlayerCards = require('./playercards')
	var cards = PlayerCards.build(properties, eventEmitter);
	var player = new Player(eventEmitter, gui, cards);

	player.init();

	return player;
}

module.exports = Player;
module.exports.build = build;