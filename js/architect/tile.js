/**
 * tile.js
 *
 * a tile of a map
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Tile = function(properties) {
	properties 		 = properties || {};	
	this.glyph 		 = new Game.Glyph(properties.glyph);
	this.untraversable = properties.untraversable || false;
};

Game.Tile.dungeonFloor = {
	glyph: ['.', 'darkslategray', 'lightslategray']
};

Game.Tile.dungeonWall = {
	glyph: [' ', 'slategray', '#222'],
	untraversable: true
}