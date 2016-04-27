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
	// basic ui element metadata
	properties = properties || {};
	UIElement.apply(this, arguments);
	this.type = 'Targeting';
	this.layer = properties.layer || 1;

	// skill and targeting info from properties
	this._skill           = properties.skill;
	this._targetingObject = properties.targetingObject   || {};
	this._callback        = properties.callback          || function() { return; };
	this._source          = properties.source;
	this._modifierEffects = properties.effects           || {};

	// info for calculating target
	this._choices         = undefined;
	this._map 			  = undefined;
}

util.inherits(Targeting, UIElement);

extend(Targeting, {

	build: function(drawArea, id) 
	{
		UIElement.prototype.build.apply(this, arguments);
		var map = {};
		this._emitter.Event('architect','currentMap').publish(map);
		this._map = map.data;

		this._updateChoices();
	},

	_initListeners: function() 
	{
		var e = this._emitter;
		var startOver = this._startOver.bind(this);
		this._events = [['lclick', 'Card', startOver]];

		e.subscribeEnMasse(this._events);
	},

	_updateChoices: function() 
	{
		var effects = {};
		this._emitter.Event('player','calculateSelectedCardEffects').publish(effects);
		this._modifierEffects = effects.data;
		this._choices = this._targetingObject.targetChoices(this._source, this._modifierEffects);
		this._emitter.Event('ui','clearDisplay').publish(this.layer);
	},

	_startOver: function()
	{
		this.close();
		this._emitter.Event('player','useSkill').publish(this._skill);
	},

	_getChoiceFromCoords: function(coords)
	{
		var foundChoice;
		var found = this._choices.some((choice, index) =>
		{
			foundChoice = choice.some( (tile) => ((coords[0] === tile[0]) && (coords[1] === tile[1])) );
			if (foundChoice)
			{
				foundChoice = index;
				return true;
			} 
			else return false;
		})

		if (found) return foundChoice;
		else return -1;
	},

	// draw the specified tiles
	render: function(drawCallback) 
	{
		var layer = this.layer;
		var filter = this._targetingObject.targetFilter.bind(this);
		if (!this._choices) return;

		this._choices.forEach(function(choice) {
			choice.filter(filter).forEach(function(tile) {
				var drawInfo = 
				{
					ch:  ' ',
					bg: 'rgba(123, 73, 68, 0.5)',
					layer: layer
				}
				drawCallback(tile[0], tile[1], drawInfo);
			});
		});		
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
		var coords = this._eventToPosition(e);
		var choice = this._getChoiceFromCoords(coords);
		if (choice > -1)
		{
			var targets = this._targetingObject.getTargetsInTargetingArea(this._choices[choice], this._map);		
			this._callback(targets);
		}
		e.stopPropagating = true;
		this.close();
	},
});

module.exports = Targeting;