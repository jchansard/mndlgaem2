/**
 * inputmanager.js
 *
 * handles keyboard and mouse input for Game; binds event handlers to appropriate objects
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.InputManager = function(container, guis) {
	this._container = container;
	this._guis = guis; 			// guis this inputmanager controls
	this._inputActions =  {}; 	// houses bound functions for events
	this.bubbleOrder = [];
}

Game.InputManager.prototype = {
	// initializes keymap and binds events in game container to handleInput
	init: function() 
	{	
		this.bubbleOrder = ['overlay','ui'];	//TODO: it's not arbitrary per se but make it less hardcoded maybe?
		Game.Keymap.init(); //TODO: allow rebinding
		$(this._container).on('keydown keypress click', this.handleInput.bind(this));
	},

	// binds the input actions for a given screen
	bindEvents: function(inputObject)
	{
		// loop through screen's input object
		for (var inputEvent in inputObject)
	    {
	    	var eventType 	= inputObject[inputEvent].eventType || 'keydown';
	    	var context  	= inputObject[inputEvent].context   || Game.gameShell.guis[context] || Game.gameShell.guis['ui'];
			var fn 			= inputObject[inputEvent].fn;
	    	var action;

			// initialize inputActions array if undefined
			if (this._inputActions[eventType] === undefined)
			{
				this._inputActions[eventType] = {}
			}
			if (this._inputActions[eventType][inputEvent] === undefined)
			{
				this._inputActions[eventType][inputEvent] = [];
			}
			// bind event + keymap action to screen function
	    	this._inputActions[eventType][inputEvent].push(fn.bind(context));
	    }
	},

	// unbinds events
	unbindEvents: function()
	{
		this._inputActions = {};
	},

	// given event type and keymap action, execute associated bound function
	handleInput: function(e) 
	{
		var type = e.type;
		var fn = [];
		var action;
		
		if (type == 'click')
		{
			this.handleClick(e);
			// if (e.which != 1) { return; } // left click only
			// this.bubbleOrder.forEach(function(gui) {
			// 	if (this._isActionBound('click-' + gui)) { fn.push('click-' + gui); }
			// }, this);
		}
		else // this is a keyboard action; get keymap action
		{
			action = Game.Keymap.keyCodeToAction(e.which); 
			if (this._isActionBound(type, action)) { fn = this._inputActions[type][action]; }
		}
		for (var i = 0; i < fn.length; i++)
		{
			if (e.type !== 'click') { e.preventDefault(); }
			// if handler function returns false, then keep going through bubble order
			if (fn[i](e) !== false) { return; }
		}
	},

	// given a click event, trigger associated click handlers
	handleClick: function(e, guis)
	{
		guis = guis || this._guis;
		var clickFunction = this._getClickFunction(e.which);
		for (gui in guis) {
			var clickedElements = guis[gui].getClickedElements(e);
			clickedElements.forEach(function(element) {
				if (typeof element[clickFunction] === 'function')
				{
					element[clickFunction](e);
				}
			});
		}
	},

	// converts a click event's button click to a function name
	_getClickFunction: function(button)
	{
		switch(button) 
		{
			case 1: return 'lclick';
			case 2: return 'mclick';
			case 3: return 'rclick';
			default: return false;
		}
	},

	// returns true if action is valid
	_isActionBound: function(type, action)
	{
		try 
		{
			return (this._inputActions[type][action] !== undefined);
		}
		catch (e) // catch undefined typeerrors
		{
			return false;
		}
	}
}