/**
 * uielement.js
 *
 * a ui element superclass; needs to be added to a UserInterface
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.UIElement = function(properties)
{
	properties 			= properties || {};
	this._position		= properties.position  	 	|| { x: 0, y: 0 };
	this._size			= properties.size			|| { height: 0, width: 0 };
	this._style			= properties.style 			|| {};
	this._content 		= properties.content 		|| "";
	this._gui   		= undefined;
	this._drawArea		= undefined;
	this._initStyle();
}

Game.UIElement.prototype = {

	// initialize style to default settings if overrides weren't passed
	_initStyle: function() {	
		var s = this._style;
		this._style = 
		{
			align: s.align 								|| 'left',
			bg: s.bg 									|| 'rgba(20, 20, 40, 0.8)',
			textColor: s.textColor 						|| 'lightblue',
			highlightBg: s.highlightBg   				|| 'rgba(40, 40, 80, 0.8)',
			highlightTextColor: s.highlightTextColor 	|| 'white',
			padding: s.padding							|| 0
		};
	},

	// don't override
	bindToGui: function(gui) {
		this._gui = gui;
	},

	// don't override; sets this._screen and moves the element to be in the subscreen;
	// sets size to full size of subscreen if size is set to 'fill'
	bindToScreen: function(drawArea) {
		this._drawArea = drawArea;
		this._drawArea.x = this._position.x + drawArea.x;
		this._drawArea.y = this._position.y + drawArea.y;

		if (this._size === 'fill') 
		{
			this._size = { height: drawArea.height, width: drawArea.width };
		}
	},

	// function called when ui element is closed/removed; override for different element types
	close: function() {
		return;
	},

	// draw the dialog; override this for different element types
	render: function() {
		return;
	},

	// get input events for this dialog; override for different element types
	getInputEvents: function() {
		return {};
	},

	// what to do when this element is left clicked; override for different element types
	lclick: function(e) {
		return false;
	}
}

