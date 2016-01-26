/**
 * dialog.js
 *
 * menu-style prompt; needs to be added to a UserInterface
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
 Game.Dialog = function(properties)
{
	this._title			= properties.title 			|| "";
	this._options 	 	= properties.options 		|| [];
	this._choice		= properties.choice 		|| 0;
	this._position		= properties.position  	 	|| { x: 0, y: 0 };
	this._size			= properties.size			|| this._calculateSize();
	this._callback		= properties.callback;
	this._style			= properties.style;
	this._initStyle();
}

Game.Dialog.prototype = {

	// calculate size based on title and options, TODO: add padding option
	_calculateSize: function() {
		var width = this._title.length;
		var height = (this._title == "") ? 0 : 2;
		for (var i = 0; i < this._options.length; i++)
		{
			width = Math.max(width, this._options[i].length);
			height++;
		}
		return { height: height, width: width };
	},

	// initialize style to default settings if overrides weren't passed
	_initStyle: function() {	//TODO: make defaults look good
		var o = this._options;
		this._style = 
		{
			align: o.align 								|| 'left',
			bg: o.bg 									|| 'rgba(20, 20, 40, 0.8)',
			textColor: o.textColor 						|| 'lightblue',
			highlightBg: o.highlightBg   				|| 'rgba(40, 40, 80, 0.8)',
			highlightTextColor: o.highlightTextColor 	|| 'white'
		};
	},

	bindToGui: function(guiId) {
		this._guiId = guiId;
		this._gui = Game.guis[guiId];
	},

	close: function() {
		//TODO: animate
		this._gui.closeDialog(this);
	},

	// draw the dialog; override this for different dialog types
	render: function() {
		Game.DrawUtils.drawBorder(this._gui, 'full', this._position, this._size);

		var y = this._position.y;

		if (this._title) {
			this._gui.drawText('full',
			{
				x: this._position.x,
				y: y,
				text: '%b{' + this._bg + '}' + this._title
			});
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
			this._gui.drawText('full',
			{
				x: this._position.x,
				y: y,
				text: text
			});
			y++;
		}
	},

	// get input events for this dialog; override for different dialog types
	getInputEvents: function() {
		var inputEvents = {
			down: {
				context: this._guiId,
				fn: function() { this.nextChoice(); }
			},
			up: {
				context: this._guiId,
				fn: function() { this.prevChoice();	}
			},
			select: {
				context: this._guiId,
				fn: function() 
				{
					if (this._callback) {
						this._callback(this._choice);
						this.close();
					}
				}
			},
			click: {
				context: this._guiId,
				fn: function(e)
				{
					var coords = this._gui.eventToPosition(e);
					if (Game.MouseUtils.areCoordsInBounds(coords, this._position, this._size))
					{
						var choice = this.coordsToChoice(coords);
						this.setChoice(choice);
						this._callback(choice);
						this.close();
					}
					else
					{
						return false;
					}
				}
			}
		};
		return inputEvents;
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

	// given the coords of a mouse click event coordinated to the canvas' grid, return the corresponding choice
	coordsToChoice: function(coords)
	{
		var y = coords[1];
		y -= this._position.y;
		if (this._title) { y -= 2; } // TODO: hacky?
		return y;
	}
}

