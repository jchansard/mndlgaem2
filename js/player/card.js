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
	properties = properties       || {};	
	this._name = properties.name  || 'Placeholder';
	this.power = properties.power || 0;
	this.cdr   = properties.cdr   || 0;
	this.selected = false;
};

Game.Card.prototype = 
{
	select: function(override) 
	{
		this.selected = (override !== undefined) ? override : (this.selected) ? false : true;
	},
}