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
	this._choices      = properties.choices;
	this._targetFilter = properties.filter;
	this._callback     = properties.callback;
	this.layer         = properties.layer    || 1;
	this._targetEntities = [];
	this._map = undefined;
}

util.inherits(Targeting, UIElement);

extend(Targeting, {

	build: function(drawArea) 
	{
		UIElement.prototype.build.apply(this, arguments);
		var map = {};
		this._emitter.Event('architect','currentMap').publish(map);
		this._map = map.data;
	},

	// draw the specified tiles
	render: function(drawCallback) 
	{
		var layer = this.layer;
		var filter = this._targetFilter.bind(this);

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
		e.stopPropagating = true;
		this._callback(this._targetEntities);
		this.close();
	},
});

module.exports = Targeting;