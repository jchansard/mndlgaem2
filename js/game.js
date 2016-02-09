/**
 * game.js
 *
 * basically main()
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

Game = {};

Game.GameShell = function() {
	// set constants
	const CANVASTILESIZE = 12;
	const UIBACKGROUND = '#171812';
	const OVERLAYBACKGROUND = 'transparent';
	const GAMECONTAINER = 'div#game-container'

	// gui layers
	this.guis = {};

    // create display objects
	var subscreens = {};
	subscreens['full'] = {	x: 0, y: 0,	width: 60, height: 20 }; 
	subscreens['mapterminal'] =  { x: 0, y: 0,	width: 60, height: 20 }; 
    this.guis['ui'] = new Game.UserInterface({ bg: UIBACKGROUND }, subscreens, 'div#game');
    this.guis['overlay'] = new Game.UserInterface({ bg: OVERLAYBACKGROUND}, subscreens, 'div#overlay');

    // init input	
	this.inputManager = new Game.InputManager(GAMECONTAINER, this.guis);
	this.inputManager.init();
} 

Game.GameShell.prototype = {
	init: function() {
		// init uis
		for (gui in this.guis)
		{
			this.guis[gui].init();
		}

   		// load starting screen
   		this.guis['ui'].changeScreen(Game.Screens.startScreen);
   		// start ticking
		this.tick();
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

$(document).ready(function() {
	Game.gameShell = new Game.GameShell();
	Game.gameShell.init();     
});    