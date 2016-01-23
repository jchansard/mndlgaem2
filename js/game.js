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
	init: function() {
		// constants
		this.CANVASTILESIZE = 12;
		
		// init input
		Game.InputManager.init();

        // create display objects
        var screens = [];
    	screens['full'] = {	x: 0, y: 0,	width: 60, height: 20 };  	

        this.ui = new Game.UserInterface({width: 50, height: 20, startingScreen: Game.Screens.startScreen }, screens, '#game');

    },
};

$(document).ready(function() {
		Game.init();     
});    