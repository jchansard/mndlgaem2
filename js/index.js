/**
 * index.js
 *
 * starts game
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var GameShell = require('./js/game.js');

var options = 
{
	startScreen: 'startScreen'
}

var game = new GameShell(options);
game.init();