/**
 * game.js
 *
 * basically main()
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const Player       = require('./player/player.js')
const Emitter      = require('./eventemitter')
const Architect    = require('./architect/architect.js')
const UI           = require('./display/ui.js')
const InputManager = require('./input/inputmanager.js');

var GameShell = function(options) {
	options = options || {};

	// set constants
	const CANVASTILESIZE = options.tilesize || 12;
	const UIBACKGROUND	 = options.bg || '#171812';
	const OVERLAYBACKGROUND = 'transparent';
	const GAMECONTAINER  = options.container || 'div#game-container'

	// set start screen
	this._startScreen = options.startScreen;

	// init event manager
	this.eventEmitter = new Emitter();
	// init gui layers
	this.guis = {};
	// init player

	this.player    = Player.build(this.eventEmitter);

	// init architect
	this.architect = Architect.build({}, this.player);
	this.architect.init();

    // create display objects
	var subscreens = {};
	subscreens['full'] = {	x: 0, y: 0,	width: 60, height: 30 }; 
	subscreens['mapterminal'] =  { x: 0, y: 0,	width: 60, height: 20 }; 

    this.guis['ui'] = new UI({ bg: UIBACKGROUND }, 'div#game', this, this.eventEmitter);
    // this.guis['overlay'] = new Game.UserInterface({ bg: OVERLAYBACKGROUND }, 'div#overlay');

    // init input	
	this.inputManager = InputManager.build(GAMECONTAINER, this.guis, this.eventEmitter);
	this.inputManager.init();

} 

GameShell.prototype = {
	init: function() {
		// init uis
		for (gui in this.guis)
		{
			this.guis[gui].init();
		}

		// define draw areas
		this.defineDrawAreas();

   		// load starting screen
   		this.guis['ui'].changeScreen(this._startScreen);
   		// start ticking
		this.tick();
	},

	// TODO: modularize better
	defineDrawAreas: function() {
		var drawAreas = [{
			name: 'full',
			x: 0,
			y: 0,
			width: 60, 
			height: 20, 
			layer: 0
		}, {
			name: 'mapterminal',
			x: 1,
			y: 1,
			width: 60,
			height: 20,
			layer: 0
		}, {
			name: 'skillterminal',
			x: 0,
			y: 20,
			width: 40,
			height: 6,
			layer: 0
		},
		{
			name: 'handterminal',
			x: 0,
			y: 26,
			width: 40,
			height: 10,
			layer: 0
		}];

		drawAreas.forEach(function(scr)
		{
			this.defineDrawArea(scr.name, scr);
		}.bind(this.guis['ui']));
	},

	tick: function() {
		this.render();
		window.requestAnimationFrame(this.tick.bind(this));
	},

	render: function() {
		for (var gui in this.guis)
		{
			if (typeof this.guis[gui].render === 'function') { this.guis[gui].render(); }
		}
	}
}

module.exports = GameShell;