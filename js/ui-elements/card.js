/**
 * card.js
 *
 * ui element representing a card in a deck
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const UIElement = require('./uielement');
const util   = require('util');
const extend = require('../util/extend.js');

var Card = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	UIElement.apply(this, arguments);

	this.boundCard = properties.card;
}

util.inherits(Card, UIElement);

extend(Card, {

	// draw the dialog; override this for different dialog types
	render: function(drawCallback) 
	{
		var card = this.boundCard;
		// don't draw blank cards
		if (card === undefined) { return; }

		var fg = (card.selected) ? 'green' : undefined;
		var drawInfo = 
		{
			type: 'border',
			size: this.size,
			options:
			{
				fg: fg
			}
		}
		drawCallback(this.position.x, this.position.y, drawInfo);
		var pow = '%c{red}%s'.format(card.power);
		var cdr = '%c{lightblue}%s'.format(card.cdr);
		drawCallback(this.position.x+1, this.position.y+1, { text: pow });
		drawCallback(this.position.x + this.size.width-2, this.position.y + this.size.height-2, { text: cdr });

	},

	// get input events for this dialog
	getInputEvents: function() 
	{
		var card = this.boundCard;
		var inputEvents = {

		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) 
	{
		this.boundCard.select();
		return;
	},
});

module.exports = Card;