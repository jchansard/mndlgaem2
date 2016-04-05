/**
 * userinterface.js
 *
 * handle drawing, navigating, and switching between screens on a ROT display object
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const ROT    = require('rot-js');
const $      = require('jquery');
const temere = require('temere');
const extend = require('../util/extend.js')
const mouseUtils = require('./drawutils');
const drawUtils  = require('./mouseutils');

// override ROT draw to fix blurry text

ROT.Display.Rect.prototype._drawNoCache = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	if (clearBefore) { 
		var b = this._options.border;
		this._context.fillStyle = bg;
		this._context.clearRect(x*this._spacingX + b, y*this._spacingY + b, this._spacingX - b, this._spacingY - b);
		this._context.fillRect(x*this._spacingX + b, y*this._spacingY + b, this._spacingX - b, this._spacingY - b);
	}
	
	if (!ch) { return; }

	this._context.fillStyle = fg;

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		this._context.fillText(chars[i], (x+0.5) * this._spacingX, Math.ceil((y+0.5) * this._spacingY));
	}
}

var UserInterface = function(properties, container, gameShell, eventEmitter) {
	properties 		    = properties 		  	|| {};
	this._height 	    = properties.height  	|| 36;
	this._width 	    = properties.width   	|| 60;
	this._bg 		    = properties.bg 	  	|| 'black';
	this._fontSize 	    = properties.fontSize 	|| 16;
	this._fontFamily    = properties.fontFamily || 'inconsolata';
	this.id             = properties.id;
	this._screen 	    = undefined;
	this._drawAreas     = {};
	this._elements 	    = [];
	this._elementsLayerIndex = [];
	this._elementsIDIndex = {};
	this._activeElement = null;
	this._container     = container;
	this.gameShell		= gameShell;
	this._emitter  		= eventEmitter;
	this._idGen         = undefined;

	// init layers. Layers are extra transparent canvases created on top of the display
	// with the same height, position, and font properties.
	var layers 		 = properties.layers || 1;
	this._displays   = new Array(layers);

	for (var l = 0; l < layers; l++)
	{
		var bg = (l === 0) ? this._bg : 'transparent'; // overlay layers are transparent

		this._displays[l] = (new ROT.Display({
			height: 	this._height, 
			width:  	this._width, 
			bg: 		bg, 
			fontSize:   this._fontSize, 
			fontFamily: this._fontFamily
		}));		
	}
};

UserInterface.prototype = {
	init: function() 
	{
		this._displays.forEach(function(d)
		{
			$(d.getContainer()).css('position', 'absolute');
			$(this._container).append(d.getContainer());
		}.bind(this));
		this._initListeners();
		this._idGen = new temere();
	},

	_initListeners: function() 
	{
		var e = this._emitter;		
		var id = this.id;
		var eventToPosition = this.eventToPosition.bind(this);
		var addElement      = this.addElement.bind(this);
		var closeElement    = this.closeElement.bind(this);

		e.Event(id,'eventToPosition').subscribe(eventToPosition);
		e.Event(id,'addElement').subscribe(addElement);
		e.Event(id,'closeElement').subscribe(closeElement);
	},

	_generateElementID: function()
	{
		return this._idGen.next();
	},

	render: function() 
	{
		// render screen
    	if (this.renderCurrentScreen) { this.renderCurrentScreen(); } 

    	// render all elements
    	var elements = this._elements;
    	var callback = this.draw.bind(this);
    	this._elementsLayerIndex.forEach(function(layer)
    	{
    		layer.forEach(function(element)
    		{
	    		elements[element].render(callback);
    		});
    	});
	},

	changeScreen: function(screenName) 
	{	
		// get screen from screen name
		var data = {};
		this._emitter.Event('screen','getScreen').publish(screenName, data);
		var screen = data.screen;

	    if (this._screen && this.exitCurrentScreen) {
	    	this.exitCurrentScreen();
	    }
	    // bind screen functions 
	    this._screen = screen;
	    this.enterCurrentScreen  = this._screen.enter;
	    this.exitCurrentScreen	 = this._screen.exit;
	    this.renderCurrentScreen = this._screen.render;
	  	
	    // unbind old events
	    this.unbindInputEvents();

	  	// bind input events based on screen
	    this.bindInputEvents(this._screen.inputEvents, true);

	    // enter and render screen
        this.enterCurrentScreen();
        this.render();
	},

	// defines a draw area. the screen can be split into draw areas,
	// making it easier to add elements to the appropriate area.
	defineDrawArea: function(name, drawArea)
	{
		var layer = drawArea.layer || 0;
		this._drawAreas[name] = {
			id: name,
			x: drawArea.x,
			y: drawArea.y,
			height: drawArea.height,
			width: drawArea.width,
			layer: layer
		};
	},

	bindInputEvents: function(inputEvents) 
	{
		// get input manager
		this._emitter.Event('input','bindEvents').publish(inputEvents);
	},

	unbindInputEvents: function()
	{
		this._emitter.Event('input','unbindEvents').publish();
	},

	// adds a new element to the gui and binds it to this gui
	addElement: function(elementConstructor, options, drawArea, returnObject) 
	{
		returnObject = returnObject || {};
		
		// set draw area
		drawArea = (drawArea !== undefined) ? this._drawAreas[drawArea] : this._drawAreas['full'];

		// construct element
		var element = new elementConstructor(options, this.id, this._emitter);	

		// generate id
		var elementID = this._generateElementID();

		// build, if possible
		if (typeof element.build === 'function') { element.build(drawArea, elementID); }

		// init, if possible
		if (typeof element.init  === 'function') { element.init(); }

		// get index of new element and add it to elements array
		var index = this._elements.length;
		this._elements.push(element);

		// add element to indices
		var layer = element.layer || 0;

		this._elementsLayerIndex[layer] = this._elementsLayerIndex[layer] || [];
		this._elementsLayerIndex[layer].push(index);

		if (elementID) { this._elementsIDIndex[elementID] = index; }

		// if this is the first element added, set it to active
		if (index === 0)
		{
			this.setActiveElement(index);
		}

		// return the added element
		returnObject.data = element;
		return returnObject.data;
	},

	// remove an element from the ui and clean up indices
	closeElement: function(elementID)
	{
		// get element index
		var index = this._elementsIDIndex[elementID];
		var layer = this._elements[index].layer || 0;

		this.clearDisplay(layer);

		// set to null and splice elements
		this._elements[index] = null;
		this._elements.splice(index, 1);



		// clean up indices
		this._cleanUpIndices(index, elementID, layer);
	},

	// cleans up the elementsIDIndex and the elementsLayerIndex
	_cleanUpIndices: function(index, elementID, layer)
	{
		delete this._elementsIDIndex[elementID];
		this._elementsLayerIndex[layer] = this._elementsLayerIndex[layer].filter(function(value) {
			return value != index;
		});
	},

	// clears all elements 
	clearAllElements: function() 
	{
		this._elements = [];
		this._elementsLayerIndex = [];
		this._elementsIDIndex = {};
	},

	// don't think i use this. uncomment if i ever do.
	// closeDialog: function(dialog)
	// {
	// 	var index = this._dialogs.indexOf(dialog);
	// 	if (index > -1)
	// 	{
	// 		this._dialogs.splice(index, 1);
	// 	}
	// 	if (index == this._activeDialog)
	// 	{
	// 		this._activeDialog--;
	// 		if (this._activeDialog < 0) { this._activeDialog = null;	}
	// 	}
	// },

	// returns the active element, or false if there aren't any elements bound to this gui
	activeElement: function()
	{
		if (this._elements.length == 0) return false;
		else return this._elements[this._activeElement];
	},

	// sets active element to the passed index. 
	// TODO: I suspect I'll need to enhance this to support a passed element object for click events
	setActiveElement: function(element) 
	{
		this._activeElement = element;
		var inputEvents = this._elements[element].getInputEvents();
		this.bindInputEvents(inputEvents);
	},	

	// clears display; wraps ROT function with extra handling for transparent layers
	clearDisplay: function(layer)
	{
		layer = layer || 0;
		this._displays[layer].clear();
		if (layer > 0) { this._clearTransparentLayer(layer); }
	},

	// converts a click event to canvas coordinates; wraps ROT function
	eventToPosition: function(e, layer, returnObject)
	{
		layer = layer || 0;
		returnObject = returnObject || {};
		returnObject.data = this._displays[layer].eventToPosition(e);
		return returnObject.data;
	},

	// get all clicked elements
	getClickedElements: function(e)
	{
		var coords = this.eventToPosition(e);
		var clickedElements = [];

		// use layer index so that "higher" elements are returned first
		for (var i = this._elementsLayerIndex.length - 1; i > -1; i--)
		{
			if (!this._elementsLayerIndex[i]) continue;

			// loop through elements via index
			this._elementsLayerIndex[i].forEach(function(index) 
			{
				var element = this._elements[index];
				
				// if coords are in bounds, add to list to return
				if (this.coordsAreInBounds(coords, element.position, element.size))
				{
					clickedElements.push(element);
				}
			}.bind(this));
		}

		return clickedElements;
	},

};		

// add draw and mouse utility functions
extend(UserInterface, drawUtils);		
extend(UserInterface, mouseUtils);

module.exports = UserInterface;