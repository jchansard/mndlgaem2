/**
 * levels.js
 *
 * level building objects used by architect
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const Tile = require('./tile')
const ROT  = require('rot-js');

module.exports = {
	testDungeon : {
		width: 40,
		height: 20,

		floorTile: Tile.dungeonFloor,
		wallTile: Tile.dungeonWall,

		mapType: ROT.Map.Arena,
		mapTypeCallback: function(x, y, value) 
		{
			this.tiles[x][y] = (value === 1) ? new Tile(this.properties.wallTile) : new Tile(this.properties.floorTile);
		},

		init: function() 
		{
			//this.addEntity(Game.gameShell.player);
		}
	}
};

