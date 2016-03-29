/**
 * create2darray.js
 *
 * creates a 2D array
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
module.exports = function(width, height, initialValue)
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