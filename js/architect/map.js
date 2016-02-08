/**
 * map.js
 *
 * a 2d array of tiles representing a level's map
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Map = function(tiles) {
	this._tiles = tiles;
};

Game.Map.prototype = {
	draw: function(drawCallback, thisArg)
	{
		for (var x = 0; x < this._tiles.length; x++)
		{
			for (var y = 0; y < this._tiles[x].length; y++)
			{
				var glyph = this._tiles[x][y].glyph;
				var drawInfo = { x: x, y: y, ch: glyph.ch, fg: glyph.fg, bg: glyph.bg }
				drawCallback.call(thisArg, 'full', drawInfo);
			}
		}	
	},
}
