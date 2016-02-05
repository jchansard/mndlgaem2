/**
 * mouseutils.js
 *
 * utils for mouse events
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Utils = 
{
	coordsAreInBounds: function(coords, position, size) 
	{
		var x, y;
		if (coords instanceof Array) 	// it's an array with x = coords[0], y = coords[1]
		{
			x = coords[0];
			y = coords[1];
		}
		else			// it's a simple object with x = coords.x, y = coords.y
		{
			x = coords.x;
			y = coords.y;
		}
		// verify x is in bounds
		if (x < position.x || x >= position.x + size.width) { return false; }
		// verify y is in bounds
		if (y < position.y || y >= position.y + size.height) { return false; }
		// if we made it here, coords are in bounds
		return true;
	},

	// clones a simple object. Does not copy functions.
	cloneSimpleObject: function(source)
	{
		return JSON.parse(JSON.stringify(source));
	},

	// this basically saves me from having to do:
	//   Game.NewObject.Prototype.functionName = function() { } 
	// for each new method, and I can instead use a simple object with the methods to add.
	extendPrototype: function(target, source)
	{
		var prototype = target.prototype;
		for (prop in source)
		{
			prototype[prop] = source[prop];
		}
	}
}