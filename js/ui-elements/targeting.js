/**
 * targeting.js
 *
 * visual representation of skill targeting system
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const UIElement = require('./uielement');
const util   = require('util');
const extend = require('../util/extend.js');

var Targeting = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	UIElement.apply(this, arguments);
}

util.inherits(Targeting, UIElement);

extend(Targeting, {

	// draw the dialog; override this for different dialog types
	render: function(drawCallback) 
	{
		var drawInfo = 
		{
			ch:  '*',
			fg: 'red',
			bg: 'rgba(0,0,0,0.1)',
			layer: 1
		}
		drawCallback(this.position.x+1, this.position.y+1, drawInfo);
		this.dirty = false;
	},

	// get input events for this dialog
	getInputEvents: function() 
	{
		var inputEvents = {


		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) 
	{
		return;
	},
});

module.exports = Targeting;