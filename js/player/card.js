/**
 * card.js
 *
 * a game card
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
 var Card = function(properties) {
	properties = properties       || {};	
	this._name = properties.name  || 'Placeholder';
	this.power = properties.power || 0;
	this.cdr   = properties.cdr   || 0;
	this.selected = false;
};

Card.prototype = 
{
	select: function(override) 
	{
		this.selected = (override !== undefined) ? override : (this.selected) ? false : true;
	},

	// returns info about card properties (not card object metadata)
	info: function()
	{
		return {
			power: this.power,
			cdr: this.cdr
		};
	}
}

module.exports = Card;

//MAKE AN INFO THING THAT RETURNS ALL USEFUL KEYS