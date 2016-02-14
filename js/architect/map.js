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
	this._entities = [];
};

Game.Map.prototype = {
	draw: function(drawCallback, thisArg, drawArea)
	{
		for (var x = 0; x < this._tiles.length; x++)
		{
			for (var y = 0; y < this._tiles[x].length; y++)
			{
				var glyph = this._tiles[x][y].glyph;
				var drawInfo = { x: x, y: y, ch: glyph.ch, fg: glyph.fg, bg: glyph.bg }
				drawCallback.call(thisArg, drawArea, drawInfo);
			}
		}

		this._entities.forEach(function(e)
		{
			var drawInfo = { x: e.x, y: e.y, ch: e.glyph.ch, fg: e.glyph.fg, bg: e.glyph.bg };
			drawCallback.call(thisArg, drawArea, drawInfo);
		});
	},

	addEntity: function(entity)
	{
		console.log(entity);
		var entity = { glyph: entity.glyph, x: entity.position.x, y: entity.position.y };
		this._entities.push(entity);
	}
}
