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
		var inputEvents = {
			down: {
				context: this._player,
				fn: function() { this.actor._y += 1; }
			},
			up: {
				context: this._player,
				fn: function() { this.actor._y -= 1; }
			},
			left: {
				context: this._player,
				fn: function() { this.actor._x -= 1; }
			},
			right: {
				context: this._player,
				fn: function() { this.actor._x += 1; }
			}
		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) {
		return;
	},
});