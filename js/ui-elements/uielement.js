/**
 * uielement.js
 *
 * a ui element superclass; needs to be added to a UserInterface
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var UIElement = function(properties, gui, eventEmitter)
{
	properties 			= properties || arguments[0] || {};
	this.init           = properties.init;
	this.type           = this.type  || 'UIElement';
	this.position		= properties.position  	 	 || { x: 0, y: 0 };
	this.size			= properties.size			 || 'fill'
	this.layer          = properties.layer           || 0;
	this._style			= properties.style 			 || {};
	this._content 		= properties.content 		 || "";
	this._emitter		= eventEmitter;
	this._events        = null;
	this._gui           = gui;
	this.drawArea       = undefined;

}

UIElement.prototype = {

	build: function(drawArea, id) {
		this._initStyle();
		this._initPosition(drawArea);
		this._initSize(drawArea)
		this.drawArea = drawArea.id;
		this.id = id;
	},

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

	// don't override; moves the element to be in the specified area
	_initPosition: function(drawArea) 
	{
		this.position.x = this.position.x + drawArea.x;
		this.position.y = this.position.y + drawArea.y;
	},

	// sets size to full size of draw area if size is set to 'fill'
	_initSize: function(drawArea) 
	{
		if (this.size === 'fill') 
		{
			this.size = { height: drawArea.height, width: drawArea.width };
		}
	},

	// function called when ui element is closed/removed; override for different element types
	close: function() {
		this._emitter.Event(this._gui,'closeElement').publish(this.id);
		return;
	},

	// draw the dialog; override this for different element types
	render: function(drawCallback) {
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

module.exports = UIElement;