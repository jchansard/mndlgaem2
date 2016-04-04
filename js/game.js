/**
 * game.js
 *
 * basically main()
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const Player        = require('./player/player.js');
const Emitter       = require('./eventemitter');
const Architect     = require('./architect/architect.js');
const UI            = require('./display/ui.js');
const InputManager  = require('./input/inputmanager.js');
const ScreenManager = require('./game-flow/screenmanager.js');
const screens       = require('./game-flow/screens.js')

var GameShell = function(options) {
	options = options || {};

	// set constants
	const CANVASTILESIZE = options.tilesize || 12;
	const UIBACKGROUND	 = options.bg || '#171812';
	const OVERLAYBACKGROUND = 'transparent';
	const GAMECONTAINER  = options.container || 'div#game-container'

	// init event manager
	this.eventEmitter = new Emitter();

	// init screen manager
	this.screenmanager = ScreenManager.build(this.eventEmitter, screens);
	
	// get start screen
	this._startScreen = options.startScreen;
	// init gui layers
	this.guis = {};

	// init guis
    this.guis['ui'] = new UI({ id: 'ui', bg: UIBACKGROUND, layers: 2 }, 'div#game', this, this.eventEmitter);
    // this.guis['overlay'] = new Game.UserInterface({ bg: OVERLAYBACKGROUND }, 'div#overlay');

    // init input	
	this.inputManager = InputManager.build(GAMECONTAINER, this.guis, this.eventEmitter);

	// init player
	this.player = Player.build(this.eventEmitter, 'ui');

	// init architect
	this.architect = Architect.build({}, this.player);

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
		var drawAreas = require('./display/drawareas');
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