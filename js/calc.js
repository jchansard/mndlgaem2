/**
 * calc.js
 *
 * misc math functions
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
 Game.Calc = function() {

 }

 Game.Calc.prototype = {
 	distanceBetweenPoints: function(point1, point2)
 	{
 		var x1 = point1[0];
 		var x2 = point2[0];
 		var y1 = point1[1];
 		var y2 = point2[1];

 		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
 	}
 }