/**
 * card.js
 *
 * a game card
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
 Game.Card = function(properties) {
	properties  = properties       || {};	
	this._name  = properties.name  || 'Placeholder';
	this._power = properties.power || 0;
	this._cdr   = properties.cdr   || 0;
};