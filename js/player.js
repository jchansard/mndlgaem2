/**
 * player.js
 *
 * contains player info: skills, player deck, pointer to actor, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Player = function() {
	this.glyph = new Game.Glyph(['@', 'white', 'none']);
	this.position = { x: 1, y: 1 };
}