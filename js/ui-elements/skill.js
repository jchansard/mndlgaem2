/**
 * skill.js
 *
 * ui element representing a player skill
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const UIElement = require('./uielement');
const util   = require('util');
const extend = require('../util/extend.js');

var Skill = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	UIElement.apply(this, arguments);

	this.boundSkill = properties.skill;
}

util.inherits(Skill, UIElement);

extend(Skill, {

	// draw the dialog; override this for different dialog types
	render: function() 
	{
		var skill = this.boundSkill;
		// don't draw blank skills
		if (skill === undefined) { return; }

		var gui  = this._gui;

		// Game.DrawUtils.drawBorder(gui, this.position, this.size);
		gui.draw(this.position.x, this.position.y, { text: skill.name });
		// var pow = '%c{red}%s'.format(card.power);
		// var cdr = '%c{lightblue}%s'.format(card.cdr);
		// gui.drawText(this.position.x+1, this.position.y+1, { text: pow });
		// gui.drawText(this.position.x + this.size.width-2, this.position.y + this.size.height-2, { text: cdr });

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
		this.boundSkill.select();
		return;
	},
});

module.exports = Skill;