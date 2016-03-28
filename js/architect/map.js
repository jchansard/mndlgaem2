/**
 * map.js
 *
 * a 2d array of tiles representing a level's map
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var GameMap = function(tiles) {
	this._tiles = tiles;
	this._entities = [];
};

GameMap.prototype = {
	draw: function(drawCallback, thisArg)
	{
		// draw map 
		for (var x = 0; x < this._tiles.length; x++)
		{
			for (var y = 0; y < this._tiles[x].length; y++)
			{
				if (this._tiles[x][y] === undefined)
				{
					console.log(x + ',' + y);
				}
				var glyph = this._tiles[x][y].glyph;
				var drawInfo = { ch: glyph.ch, fg: glyph.fg, bg: glyph.bg }
				drawCallback.call(thisArg, x, y, drawInfo);
			}
		}

		// draw entities
		this._entities.forEach(function(e)
		{
			e.draw(drawCallback, thisArg);
		});
	},

	addEntity: function(entity)
	{
		this._entities.push(entity);
		entity.setMap(this);
	},

	getTile: function(x, y)
	{
		return this._tiles[x][y];
	},

	isTraversable: function(x, y)
	{
		return !this._tiles[x][y].untraversable;
	}
}

module.exports = GameMap;