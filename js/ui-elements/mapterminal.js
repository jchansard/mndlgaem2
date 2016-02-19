/**
 * mapterminal.js
 *
 * draws a map to screen, managing scrolling, etc
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.MapTerminal = function(properties, map, player)
{
	properties = properties || {};
	Game.UIElement.call(this, properties);
	this._size          = properties.size;
	this._map			= map;	
	this._player		= player;
}

Game.MapTerminal.extend(Game.UIElement);
Game.Utils.extendPrototype(Game.MapTerminal, {

	close: function() {
		//TODO: animate?
		return;
	},

	// draw the dialog; override this for different dialog types
	render: function() {
		this._map.draw(this._gui.draw, this._gui, this._drawArea);
		return;
	},

	// get input events for this dialog
	getInputEvents: function() {
		var context = this._gui;
		var player = this._player;
		var inputEvents = {
			down: {
				context: player,
				fn: player.moveDown
			},
			up: {
				context: player,
				fn: player.moveUp
			},
			left: {
				context: player,
				fn: player.moveLeft
			},
			right: {
				context: player,
				fn: player.moveRight
			}
		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) {
		return;
	},
});