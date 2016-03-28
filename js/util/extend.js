/**
 * extend.js
 *
 * extends prototype of target with all the properties in source, a simple object
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

// this basically saves me from having to do:
//   Game.NewObject.Prototype.functionName = function() { } 
// for each new method, and I can instead use a simple object with the methods to add.
module.exports = function(target, source)
{
	var prototype = target.prototype;
	for (prop in source)
	{
		prototype[prop] = source[prop];
	}
}