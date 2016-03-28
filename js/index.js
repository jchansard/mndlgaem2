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
const screens = require('./js/game-flow/screens.js')

var options = 
{
	startScreen: screens.startScreen
}

var game = new GameShell(options);
game.init();