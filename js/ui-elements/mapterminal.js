/**
 * mapterminal.js
 *
 * draws a map to screen, managing scrolling, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const UIElement = require('./uielement');
const util   = require('util');
const calc   = require('../util/calc');
const extend = require('../util/extend.js');

var MapTerminal = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	UIElement.apply(this, arguments);
	this._map			= properties.map;	
	this._player		= properties.player;
}

util.inherits(MapTerminal, UIElement);

extend(MapTerminal, {

	close: function() {
		//TODO: animate?
		return;
	},

	// draw the dialog
	render: function(drawCallback) {
		this._map.draw(drawCallback, this._drawArea);
		return;
	},

	// get input events for this dialog
	getInputEvents: function() {
		var context = this._gui;
		var player  = this._player;
		var topic   = player.id;
		var handler = this._emitter.Event(topic,'move').publish;
		var inputEvents = {
			down: {
				context: player,
				fn: function() { handler('down'); }
			},
			up: {
				context: player,
				fn: function() { handler('up'); }
			},
			left: {
				context: player,
				fn: function() { handler('left'); }
			},
			right: {
				context: player,
				fn: function() { handler('right'); }
			}
		};
		return inputEvents;
	},

	// TODO: make this less big
	lclick: function(e) {
		var emitter = this._emitter;
		var clickedCoords = this._gui.eventToPosition(e);
		var playerCoords = this._player.position();
		var legCoords = [playerCoords[0], clickedCoords[1]];

		var distancePlayerToLeg = calc.distanceBetweenPoints(playerCoords, legCoords);
		var distanceLegToClick  = calc.distanceBetweenPoints(legCoords, clickedCoords);
		var direction;

		// if distance from leg to click is greater, than move up or down
		if (distancePlayerToLeg > distanceLegToClick)
		{
			// if player coords y > clicked coords y, move up; else down
			direction = (playerCoords[1] > clickedCoords[1]) ? 'up' : 'down';
		}
		else // distance from player to leg is greater, so move left or right
		{
			// if clicked x > player x, move right
			direction = (clickedCoords[0] > playerCoords[0]) ? 'right' : 'left';
		}

		emitter.Event(this._player.id,'move').publish(direction);
		return;
	},
});

module.exports = MapTerminal;