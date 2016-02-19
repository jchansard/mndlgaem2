/**
 * menuprompt.js
 *
 * menu-style prompt; needs to be added to a UserInterface
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.MenuPrompt = function(properties)
{
	properties = properties || {};
	Game.UIElement.call(this, properties);
	this._title			= properties.title 			|| "";
	this._options 	 	= properties.options 		|| [];
	this._choice		= properties.choice 		|| 0;
	this._callback		= properties.callback;
	this._size          = properties.size           || this._calculateSize();
	this._initStyle();
}

Game.MenuPrompt.extend(Game.UIElement);
Game.Utils.extendPrototype(Game.MenuPrompt, {

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
		return { height: height + (2 * padding), width: width + (2 * padding) };
	},

	close: function() {
		//TODO: animate?
		return;
	},

	// draw the dialog; override this for different dialog types
	render: function() {
		Game.DrawUtils.drawBorder(this._gui, this._drawArea, this._size);

		var padding = this._style.padding || 0;
		var x = 0;
		var y = 0 - padding;
		
		if (this._title !== "")
		{
			this._gui.drawText(this._drawArea, x + padding, y, { text: '%b{' + this._style.bg + '}' + this._title });
		}

		y = padding;
		if (this._content !== "") 
		{
			this._gui.drawText(this._drawArea, x + padding, y, { text: '%b{' + this._style.bg + '}' + this._content });
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
			if (this._options[opt].length < this._size.width)
			{
				text += " ";
			}
			this._gui.drawText(this._drawArea, x + padding, y, { text: text })

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
	coordsToChoice: function(e)
	{
		var coords = this._gui.eventToPosition(e);
		var y = coords[1];
		var padding = this._style.padding;
		y -= this._position.y + padding;
		if (this._content !== "") { y -= 2; } // TODO: hacky?
		if (y >= this._options.length || y < 0) { return -1; }
		return y;
	}
});

