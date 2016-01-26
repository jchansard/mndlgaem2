/**
 * game.js
 *
 * basically main()
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
var Game =  {
	//FRAMERATE = 1000 / 60 // don't need (yet?)

	// gui layers
	guis: [],

	// initialize Game object
	init: function() {
		// set constants
		this.CANVASTILESIZE = 12;
		this.UIBACKGROUND = 'black';
		this.OVERLAYBACKGROUND = 'transparent';
		
		// init input
		Game.InputManager.init();

        // create display objects
        var screens = [];
    	screens['full'] = {	x: 0, y: 0,	width: 60, height: 20 };  	
        this.guis['ui'] = new Game.UserInterface({ id: 'ui', bg: this.UIBACKGROUND }, screens, '#game');
        this.guis['overlay'] = new Game.UserInterface({ id: 'overlay', bg: this.OVERLAYBACKGROUND}, screens, '#overlay');

        // load start screen
        this.guis['ui'].changeScreen(Game.Screens.startScreen);

        // start ticking
        this.tick();
    },
    // simulate a tick
    tick: function() {
    	this.render();
    	window.requestAnimationFrame(this.tick.bind(this));
    },

    // call all guis' render functions
    render: function() {
    	for (var gui in this.guis)
    	{
    		if (this.guis[gui].render) { this.guis[gui].render(); }
    	}
    }
};

$(document).ready(function() {
		Game.init();     
});    