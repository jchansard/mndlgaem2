/**
 * architectutils.js
 *
 * utility functions for architect.js
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.ArchitectUtils = {
	floorOrWall: function(x, y, value) {
		this.tiles[x][y] = (value === 1) ? new Game.Tile(this.properties.wallTile) : new Game.Tile(this.properties.floorTile);
	},

	create2DArray: function(width, height, initialValue)
	{
		initialValue = initialValue || undefined; 
		var arr = new Array(width);
		for (var x = 0; x < width; x++)
		{
			arr[x] = new Array(height);
			if (initialValue)
			{
				for (var y = 0; y < height; y++)
				{
					arr[x][y] = initialValue;
				}
			}
		}
		return arr;
	}
};