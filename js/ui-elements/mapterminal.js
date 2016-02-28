/**
 * mapterminal.js
 *
 * draws a map to screen, managing scrolling, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.UIElements.MapTerminal = function(properties, gui, drawArea, eventEmitter)
{
	properties = properties || {};
	Game.UIElements.UIElement.apply(this, arguments);
	this._size          = properties.size;
	this._map			= properties.map;	
	this._player		= properties.player;
}

Game.UIElements.MapTerminal.extend(Game.UIElements.UIElement);
Game.Utils.extendPrototype(Game.UIElements.MapTerminal, {

	close: function() {
		//TODO: animate?
		return;
	},

	// draw the dialog
	render: function() {
		this._map.draw(this._gui.draw, this._gui, this._drawArea);
		return;
	},

	// get input events for this dialog
	getInputEvents: function() {
		var context = this._gui;
		var player = this._player;
		var handler = this._emitter.Event('player-move').publish;
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

	// TODO: set focus on click
	lclick: function(e) {
		return;
	},
});