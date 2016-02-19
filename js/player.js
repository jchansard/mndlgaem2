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
	this.actor = new Game.Entity({ //dontmakeactort???
		glyph: ['@', 'white'],
		x: 1,
		y: 1
	})
}