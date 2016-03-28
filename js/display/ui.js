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
const extend = require('../util/extend.js')
const mouseUtils = require('./drawutils');
const drawUtils  = require('./mouseutils');

var UserInterface = function(properties, container, gameShell, eventEmitter) {
	properties 		    = properties 		  	|| {};
	this._height 	    = properties.height  	|| 36;
	this._width 	    = properties.width   	|| 60;
	this._bg 		    = properties.bg 	  	|| 'black';
	this._fontSize 	    = properties.fontSize 	|| 16;
	this._fontFamily    = properties.fontFamily || 'inconsolata';
	this._screen 	    = undefined;
	this._drawAreas     = {};
	this._elements 	    = [];
	this._elementsLayerIndex = [];
	this._activeElement = null;
	this._container     = container;
	this.gameShell		= gameShell;
	this._emitter  		= eventEmitter;


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
	},

	render: function() 
	{
    	// clear the screen and re-render it
    	this.clearDisplay();
    	if (this.renderCurrentScreen) { this.renderCurrentScreen(); } 

    	// render all elements
    	var elements = this._elements;
    	this._elementsLayerIndex.forEach(function(layer)
    	{
    		layer.forEach(function(element)
    		{
	    		elements[element].render();
    		});
    	});
	},

	changeScreen: function(screen) 
	{	// TODO BIG TODO: screen manager
		if (screen == 'gameScreen') screen = require('../game-flow/screens').gameScreen;
		console.log(screen);
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
	addElement: function(elementConstructor, options, drawArea) 
	{
		// set draw area
		drawArea = (drawArea !== undefined) ? this._drawAreas[drawArea] : this._drawAreas['full'];

		// construct element
		var element = new elementConstructor(options, this, this._emitter);	
		// build, if possible
		if (typeof element.build === 'function') { element.build(drawArea); }

		// init, if possible
		if (typeof element.init  === 'function') { element.init(); }

		// get index of new element and add it to elements array
		var index = this._elements.length;
		this._elements.push(element);

		// add element to layer index
		var layer = element.layer || 0;
		this._elementsLayerIndex[layer] = this._elementsLayerIndex[layer] || [];
		this._elementsLayerIndex[layer].push(index);

		// if this is the first element added, set it to active
		if (index === 0)
		{
			this.setActiveElement(index);
		}

		// return the added element
		return element;
	},

	// clears all elements 
	clearAllElements: function() 
	{
		this._elements = [];
		this._elementsLayerIndex = [];
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

	// clears display; wraps ROT function
	clearDisplay: function(layer)
	{
		layer = layer || 0;
		this._displays[layer].clear();
	},

	// converts a click event to canvas coordinates; wraps ROT function
	eventToPosition: function(e)
	{
		return this._displays[0].eventToPosition(e);
	},

	// get all clicked elements
	getClickedElements: function(e)
	{
		var coords = this.eventToPosition(e);
		var elements = [];
		var coordsAreInBounds = this.coordsAreInBounds;
		this._elements.forEach(function(element) 
		{
			if (coordsAreInBounds(coords, element.position, element.size))
			{
				elements.push(element);
			}
		});

		return elements;
	},

	draw: function(x, y, drawInfo) {
		layer = drawInfo.layer || 0;

		// draw text if text is passed; else draw glpyh
		if (drawInfo.text === undefined)
		{
			this._drawGlyph(x, y, layer, drawInfo.ch, drawInfo.fg, drawInfo.bg);
		}
		else
		{
			this._drawText(x, y, layer, drawInfo.text, drawInfo.maxWidth);
		}
	},

	_drawGlyph: function(x, y, layer, ch, fg, bg)
	{
		this._displays[layer].draw(x, y, ch, fg, bg);
	},
	
	_drawText: function(x, y, layer, text, maxWidth) 
	{   // TODO: ALLOW LINE BY LINE (ARRAY TEXT)
		this._displays[layer].drawText(x, y, text, maxWidth);
	},

	drawToCanvas: function(id, drawInfo) {
		var mult = Game.CANVASTILESIZE || 12;
		var x = drawInfo.x || 0; 
		var y = drawInfo.y || 0;
		drawInfo.type = drawInfo.type || 'image';
		x *= mult;
		y *= mult;
		var canvas = $(id).get(0).getContext('2d');

		switch(drawInfo.type) {
			case 'image':
				var img = new Image();
				img.src = drawInfo.src; //TODO: preload!!!!!!!!
				img.addEventListener("load", function() {
					canvas.drawImage(img, x, y);
				});
				break;
			case 'text':
				y += mult; // for text, x,y = bottom left, apparently (for images it's top left?) this way, coordinates are consistent
				canvas.font = drawInfo.font || "12px inconsolata";
				canvas.fillStyle = drawInfo.color || "white";
	  			canvas.fillText(drawInfo.text, x, y);
	  			/*var x = 2;
	  			var timer = setInterval(function() {
	  				canvas.fillStyle = 'rgb(217,0,217)';
	  				canvas.fillRect(35, 107, x, 14);
	  				x += 2;
	  				if (x==160) {
	  					console.log(x);
	  					clearInterval(timer);
	  				}
	  			}, 50);*/
	  			break;
	  		default:
	  			console.err("invalid type passed to canvas: " + drawInfo.type);
	  	}
	}
};		

// add draw and mouse utility functions
extend(UserInterface, drawUtils);		
extend(UserInterface, mouseUtils);

module.exports = UserInterface;