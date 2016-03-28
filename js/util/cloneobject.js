/**
 * cloneobject.js
 *
 * clones a simple object. Does not copy functions.
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

module.exports = function(source)
{
	return JSON.parse(JSON.stringify(source));
}