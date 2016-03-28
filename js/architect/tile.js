/**
 * tile.js
 *
 * a tile of a map
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const Glyph = require('../display/glyph')

var Tile = function(properties) {
	properties 		 = properties || {};	
	this.glyph 		 = new Glyph(properties.glyph);
	this.untraversable = properties.untraversable || false;
};

Tile.dungeonFloor = {
	glyph: ['.', 'darkslategray', 'lightslategray']
};

Tile.dungeonWall = {
	glyph: [' ', 'slategray', '#222'],
	untraversable: true
}

module.exports = Tile;