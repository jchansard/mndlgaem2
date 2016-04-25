/**
 * menuprompt.js
 *
 * menu-style prompt; needs to be added to a UserInterface
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const UIElement = require('./uielement');
const util   = require('util');
const extend = require('../util/extend.js');

var MenuPrompt = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	UIElement.apply(this, arguments);
	this.type = 'MenuPrompt';
	this._title			= properties.title 			|| "";
	this._options 	 	= properties.options 		|| [];
	this._choice		= properties.choice 		|| 0;
	this._callback		= properties.callback;
}

util.inherits(MenuPrompt, UIElement);

extend(MenuPrompt, {

	// overrides prototype
	build: function(drawArea, id) {
		UIElement.prototype.build.apply(this, arguments);
		this._calculateSize(); 
	},

	// calculate size based on title and options, TODO: add padding option
	_calculateSize: function() {
		var padding = this._style.padding || 0;
		var width = this._title.length;
		var height = (this._content == "") ? 0 : 2;
		for (var i = 0; i < this._options.length; i++)
		{
			width = Math.max(width, this._options[i].length);
			height++;
		}
		this.size = { height: height + (2 * padding), width: width + (2 * padding) };
	},

	close: function() {
		//TODO: animate?
		return;
	},

	// draw the dialog; override this for different dialog types
	render: function(drawCallback) {
		drawCallback(this.position.x, this.position.y, { type: 'border', size: this.size, options: { padding: 1 }});

		var padding = this._style.padding || 0;
		var x = this.position.x;
		var y = this.position.y - padding;

		if (this._title !== "")
		{
			drawCallback(x + padding, y, { type: 'text', text: '%b{' + this._style.bg + '}' + this._title });
		}

		y = this.position.y + padding;
		if (this._content !== "") 
		{
			drawCallback(x + padding, y, { text: '%b{' + this._style.bg + '}' + this._content });
			y += 2;
		}

		for (var opt = 0; opt < this._options.length; opt++)
		{
			var text;
			if (opt == this._choice) 
			{
				text = '%c{' + this._style.highlightTextColor + '}%b{' + this._style.highlightBg + '}';
			} 
			else
			{
				text = '%c{' + this._style.textColor + '}%b{' + this._style.bg + '}'; 
			} 
			text += this._options[opt];
			if (this._options[opt].length < this.size.width)
			{
				text += " ";
			}
			drawCallback(x + padding, y, { text: text })

			y++;
		}
	},

	// get input events for this dialog
	getInputEvents: function() {
		var context = this._gui;
		var inputEvents = {
			down: {
				context: this,
				fn: function() { this.nextChoice(); }
			},
			up: {
				context: this,
				fn: function() { this.prevChoice();	}
			},
			select: {
				context: this,
				fn: this.select
			}
		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) {
		var choice = this.coordsToChoice(e);
		if (choice >= 0)
		{
			this.setChoice(this.coordsToChoice(e));
			this.select();		
		}
		else { return; }
	},

	// choose chosen choice
	select: function() {
		if (typeof this._callback === 'function') { this._callback(this._choice); }
		this.close();
	},

	// next, prev, change, and set choice
	nextChoice: function() {
		this.changeChoice(1);
	},

	prevChoice: function() {
		this.changeChoice(-1);
	},

	changeChoice: function(n) {
		var total = this._options.length;
		if (this._choice + n < 0) 
		{
			this._choice = total - 1;
		}
		else 
		{
			this._choice += n;
			this._choice = this._choice % total;
		}
	},

	setChoice: function(n) {
		this._choice = n;
	},

	// given a mouse click event coordinated to the canvas' grid, return the corresponding choice
	coordsToChoice: function(e, coords)
	{
		if (!coords)
		{
			coords = this._eventToPosition(e);		
		}

		var y = coords[1];

		var padding = this._style.padding;
		y -= this.position.y + padding;
		if (this._content !== "") { y -= 2; } // TODO: hacky?
		if (y >= this._options.length || y < 0) { return -1; }
		return y;
	}
});

module.exports = MenuPrompt;