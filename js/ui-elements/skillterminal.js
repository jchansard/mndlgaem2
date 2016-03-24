/**
 * skillterminal.js
 *
 * container for skill ui elements; displays all player skills
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

Game.UIElements.SkillTerminal = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	Game.UIElements.UIElement.apply(this, arguments);
	this._skills  = properties.skills;
	this._skillUIElements = [];
}
Game.UIElements.SkillTerminal.extend(Game.UIElements.UIElement);
Game.Utils.extendPrototype(Game.UIElements.SkillTerminal, {

	build: function(drawArea) 
	{
		Game.UIElements.UIElement.prototype.build.apply(this, arguments)
		this._initListeners();
		this._skills.forEach(function(skill, index)
		{
			this._setSkill(index, skill);
		}.bind(this))
	},

	// listen for deckChange for this terminal's deck
	_initListeners: function() 
	{
		var e 	  = this._emitter;
	},

	// draw the dialog; override this for different dialog types
	render: function() 
	{
		Game.DrawUtils.drawBorder(this._gui, this.position, this.size);// FIX OVERLAY
	},	
	_setSkill: function(index, skill)
	{
		if (this._skillUIElements[index] === undefined)
		{
			var newSkill = {
				size:
				{
					height: 1,
					width: 7
				},
				position: 
				{
					x: 1 + index * 7, // todo: dont hardcode
					y: 1
				},
				layer: 1
			};
			this._skillUIElements[index] = this._gui.addElement(Game.UIElements.Skill, newSkill, this.drawArea);
		}
		this._skillUIElements[index].boundSkill = skill;
	},
	// get input events for this dialog
	getInputEvents: function() 
	{
		var deck = this._deck;
		var inputEvents = {

		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) 
	{
		// TODO: set focus on click
		return;
	},
});