/**
 * glyph.js
 *
 * an object representing a tile or entity's glyph, storing its character, forgeround color, and background color
 *
 * if typeof any of these is a function, call that function and set the appropriate property to the result
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Glyph = function(propertiesArray) {
	if (propertiesArray === undefined) { propertiesArray = []; }
	var ch = propertiesArray[0] || '®';
	var fg = propertiesArray[1] || 'white';
	var bg = propertiesArray[2] || 'transparent';

	this.ch = (typeof ch === 'function') ? ch() : ch;
	this.fg = (typeof bg === 'function') ? fg() : fg;
	this.bg = (typeof fg === 'function') ? bg() : bg; 
};