/**
 * inputmanager.js
 *
 * handles keyboard and mouse input for Game; binds event handlers to appropriate objects
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.InputManager = {
	_inputActions: {}, // houses bound functions for events

	// initializes keymap and binds events in game container to handleInput
	init: function() 
	{	
		var GAME_CONTAINER = "#game";

		Game.Keymap.init(); //TODO: allow rebinding
		$(GAME_CONTAINER).on('keydown keypress', this.handleInput.bind(this));
	},

	// binds the input actions for a given screen
	bindEvents: function(inputObject)
	{
		// loop through screen's input object
		for (var inputEvent in inputObject)
	    {
	    	var keyEvent = inputObject[inputEvent].keyEvent || 'keydown';
	    	var context  = inputObject[inputEvent].context  || 'ui';
	    	switch (context)
			{
				case 'ui' 		: context = Game.ui; break;
				case 'player' 	: context = Game.player; break;
			}
			// bind event + keymap action to screen function
	    	this._inputActions[keyEvent + '-' +  inputEvent] = inputObject[inputEvent].fn.bind(context);
	    }
	},

	// unbinds all events
	unbindEvents: function()
	{
		//TODO: allow more granularity
		this._inputActions = {};
	},

	// given event type and keymap action, execute associated bound function
	handleInput: function(e) 
	{
		// get keymap action
		var action = Game.Keymap.keyCodeToAction(e.which); 
		
		var fn = e.type + '-' + action;
		if (typeof this._inputActions[fn] == 'function')
		{
			e.preventDefault();
			this._inputActions[e.type + '-' + action]();
		}
	}
}