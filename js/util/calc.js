/**
 * calc.js
 *
 * misc math functions
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
module.exports = {
 	distanceBetweenPoints: function(point1, point2)
 	{
 		var x1 = point1[0];
 		var x2 = point2[0];
 		var y1 = point1[1];
 		var y2 = point2[1];

 		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
 	},

	getLine: function(x1, y1, x2, y2, len) 
	{
		//TODO: fix bug with lines looking weird (e.g. when line = y-3,x-2)
	    var line = [];
	    var dx = Math.abs(x2 - x1);
	    var dy = Math.abs(y2 - y1);
	    var sx = (x1 < x2) ? 1 : -1;
	    var sy = (y1 < y2) ? 1 : -1;
	    var err = dx - dy;
	    var e2;
	    while (true) {
	        line.push([x1, y1]);
	        if ((len === undefined && (x1 == x2 && y1 == y2)) || (len !== undefined && line.length >= len)) {
	            break;
	        }
	        e2 = err * 2;
	        if (e2 > -dx) {
	            err -= dy;
	            x1 += sx;
	        }
	        if (e2 <= dx) {
	            err += dx;
	            y1 += sy;
	        }
	    }
	    return line;
 	},

 	// given a starting point, line length, and direction, return endpoint of line
	getEndPoint: function(x1, y1, length, direction) {
		var directions = 
		{
			'u': { x: 0, y: length },
			'r': { x: length, y: 0 },
			'd': { x: 0, y: - length },
			'l': { x: -length, y: 0 }
		}

		return [x1 + directions[direction].x, y1 + directions[direction].y];
	}
 };