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
	draw: function(drawCallback)
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
				drawCallback(x, y, drawInfo);
			}
		}

		// draw entities
		this._entities.forEach(function(e)
		{
			e.draw(drawCallback);
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
	},

	getEntity: function(x, y)
	{
		var pos;
		var target = null;
		this._entities.forEach((entity) =>
		{
			pos = entity.position();
			if ((pos.x === x) && (pos.y === y)) { target = entity; }
		});

		return target;
	},

	getEntitiesInArea: function(area)
	{
		var entityIndex = {};
		var indexIsBuilt = false;
		var targets = [];
		var pos;

		area.forEach((tile) =>
		{
			// build index if this is first run through
			if (!indexIsBuilt)
			{
				this._entities.forEach((entity) =>
				{
					pos = entity.position(1);
					entityIndex[pos[0] + ',' + pos[1]] = entity;
					if (pos[0]=== tile[0] && pos[1] == tile[1]) { targets.push(entity); }
				});	
				indexIsBuilt = true;
			}
			else // index is built
			{
				// check entity and add if there's an entry
				var entity = entityIndex[tile[0] + ',' + tile[1]];
				if (entity) { targets.push(entity); }
			}
		});
		return targets;
	}
}

module.exports = GameMap;