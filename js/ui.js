/**
 * userinterface.js
 *
 * handle drawing, navigating, and switching between screens on a ROT display object
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

Game.UserInterface = function(properties, screens, container) {
	properties 		 = properties 		  		|| {};
	this._height 	 = properties.height  		|| 20;
	this._width 	 = properties.width   		|| 50;
	this._bg 		 = properties.bg 	  		|| 'black';
	this._fontSize 	 = properties.fontSize 		|| 24;
	this._fontFamily = properties.fontFamily 	|| 'inconsolata';
	this._id 		 = properties.id;
	this._screen 	 = undefined;
	this._screens 	 = screens;
	this._dialogs	 = [];
	this._activeDialog = null;
	this._container  = container;
	this._display 	 = new ROT.Display({
		height: 	this._height, 
		width:  	this._width, 
		bg: 		this._bg, 
		fontSize:   this._fontSize, 
		fontFamily: this._fontFamily
	});
};

Game.UserInterface.prototype = {
	init: function() {
		$(this._container).append(this._display.getContainer());
	},

	render: function() {
    	// clear the screen and re-render it
    	this.clearDisplay();
    	if (this.renderCurrentScreen) { this.renderCurrentScreen(); } 
    	this._dialogs.forEach(function(dialog)
    	{
    		dialog.render();
    	});
	},

	changeScreen: function(screen) {
	    this._display.clear();
	    if (this._screen && this.exitCurrentScreen) {
	    	this.exitCurrentScreen();
	    }
	    // bind screen functions 
	    this._screen = screen;
	    this.enterCurrentScreen  = this._screen.enter;
	    this.exitCurrentScreen	 = this._screen.exit;
	    this.renderCurrentScreen = this._screen.render;
	  	
	  	// bind input events based on screen
	    this.bindInputEvents(this._screen.inputEvents, true);

	    // enter and render screen
        this.enterCurrentScreen();
        this.render();
	},

	bindInputEvents: function(inputEvents, unbind) {
		var inputManager = Game.gameShell.inputManager;

		// unbind previous event handlers for keyboard and mouse
	    if (unbind) { inputManager.unbindEvents(); }

	    // bind new event handlers for keyboard and mouse
	    inputManager.bindEvents(inputEvents);
	},

	show: function()
	{
		$(this._container).show();
	},

	hide: function()
	{
		$(this._container).hide();
	},

	addDialog: function(dialog, activeByDefault) 
	{
		var index = this._dialogs.length;
		this._dialogs.push(dialog);
		dialog.bindToGui(this._id);
		if (!activeByDefault == true)
		{
			this._activeDialog = index;
			this.bindInputEvents(dialog.getInputEvents(), false)
		}
		return index;
	},

	closeDialog: function(dialog)
	{
		var index = this._dialogs.indexOf(dialog);
		if (index > -1)
		{
			this._dialogs.splice(index, 1);
		}
		if (index == this._activeDialog)
		{
			this._activeDialog--;
			if (this._activeDialog < 0) { this._activeDialog =null;	}
		}
	},

	activeDialog: function()
	{
		if (this._dialogs.length == 0) return false;
		else return this._dialogs[this._activeDialog];
	},

	clearDisplay: function()
	{
		this._display.clear();
	},

	eventToPosition: function(e)
	{
		return this._display.eventToPosition(e);
	},

	getClickedElements: function(e)
	{
		var coords = this.eventToPosition(e);
		var elements = [];
		this._elements.forEach(function(element) {
			if (Game.Utils.coordsAreInBounds(coords, element._position, element._size))
			{
				elements.push(element);
			}
		});

		return elements;
	},

	draw: function(scr, drawInfo) {//x, y, toDraw, fg, bg) {
		if (scr != null && this._screens[scr] == undefined) 
		{
			console.error('no such screen: ' + scr);
			return;
		}
		scr = this._screens[scr];
		drawInfo.x = drawInfo.x || 0;
		drawInfo.y = drawInfo.y || 0; 
		drawInfo.x += scr.x;
		drawInfo.y += scr.y;
		if ((drawInfo.x > scr.x + scr.width) || (drawInfo.y > scr. y + scr.height)) {
			console.error('drawing out of designated area: ' + drawInfo.x + ',' + drawInfo.y);
			return;
		}
		if (!scr.canvasID)
		{		
			this._display.draw(drawInfo.x, drawInfo.y, drawInfo.ch, drawInfo.fg, drawInfo.bg);
		} else {
			this.drawToCanvas(scr.canvasID, drawInfo);
		}
	},
	drawText: function(scr, drawInfo, maxWidth) { // TODO: ALLOW LINE BY LINE (ARRAY TEXT)
		if (scr != null && this._screens[scr] == undefined) //TODO: doesn't work
		{
			console.error('no such screen: ' + scr);
			return;
		}
		scr = this._screens[scr];
		var x = drawInfo.x + scr.x;
		var y = drawInfo.y + scr.y;
		if ((x > scr.x + scr.width) || (y > scr.y + scr.height)) {
			console.error('drawing out of designated area');
			return;
		}		
		this._display.drawText(x, y, drawInfo.text, maxWidth);
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