/**
 * inputmanager.js
 *
 * handles keyboard and mouse input for Game; binds event handlers to appropriate objects
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.InputManager = function() {
	this._inputActions =  {}; // houses bound functions for events
	this.bubbleOrder = [];
}

Game.InputManager.prototype = {
	// initializes keymap and binds events in game container to handleInput
	init: function() 
	{	
		var GAME_CONTAINER = "#game-container";
		this.bubbleOrder = ['overlay','ui'];	//TODO: it's not arbitrary per se but make it less hardcoded maybe?
		Game.Keymap.init(); //TODO: allow rebinding
		$(GAME_CONTAINER).on('keydown keypress click', this.handleInput.bind(this));
	},

	// binds the input actions for a given screen
	bindEvents: function(inputObject)
	{
		// loop through screen's input object
		for (var inputEvent in inputObject)
	    {
	    	var eventType = inputObject[inputEvent].eventType || 'keydown';
	    	var context  = inputObject[inputEvent].context  || 'ui';
	    	var action;

	    	// if click, set action to click-context
	    	if (inputEvent == 'click')
	    	{
	    		action = 'click-' + context;
	    	}
	    	else
	    	{
	    		action = eventType + '-' + inputEvent;
	    	}

	    	// set binding context
	    	if (context == 'player') { context = Game.thisGame.player; }
	    	else 
	    	{
	    		context = (Game.thisGame.guis[context].activeDialog()) ? Game.thisGame.guis[context].activeDialog() : Game.thisGame.guis[context];
	    	}

			// bind event + keymap action to screen function
	    	this._inputActions[action] = inputObject[inputEvent].fn.bind(context);
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
		var fn = [];
		var action;
		
		if (e.type == 'click')
		{
			if (e.which != 1) { return; } // left click only
			this.bubbleOrder.forEach(function(gui) {
				if (this._isActionBound('click-' + gui)) { fn.push('click-' + gui); }
			}, this);
		}
		else // this is a keyboard action; get keymap action
		{
			action = e.type + '-' + Game.Keymap.keyCodeToAction(e.which); 
			if (this._isActionBound(action)) { fn.push(action); }
		}
		for (var i = 0; i < fn.length; i++)
		{
			if (e.type != 'click') { e.preventDefault(); }
			// if handler function returns false, then keep going through bubble order
			if (this._inputActions[fn[i]](e) != false) { return; }
		}
	},

	// returns true if action is valid
	_isActionBound: function(action)
	{
		return (typeof this._inputActions[action] == 'function');
	}
}