Game.InputManager = {

	init: function() 
	{	
		var GAME_CONTAINER = "#game"; //TODO: use after adding jquery

		Game.Keymap.init(); //TODO: allow rebinding
		var input = this;
    	var sendEventsToScreen = function(e) {
        	//$(GAME_CONTAINER).addEventListener(e, function(t) {
        	window.addEventListener(e, function(data) {
        		if (input.handleInput) {
        			input.handleInput(e, data);
        		}    
       		});
   		};
	    sendEventsToScreen('keydown');
	    sendEventsToScreen('keypress');
	},

	bindEvents: function(inputObject)
	{
		for (var inputEvent in inputObject)
	    {
	    	var keyEvent = inputObject[inputEvent].keyEvent || 'keydown';
	    	var context  = inputObject[inputEvent].context  || 'ui';
			console.log(Game.player);
	    	switch (context)
			{
				case 'ui' 		: context = Game.ui; break;
				case 'player' 	: context = Game.player; break;
			}


	    	this.inputActions[keyEvent + '-' +  inputEvent] = inputObject[inputEvent].fn.bind(context);
	    }
	},

	unbindEvents: function()
	{
		//TODO: allow more granularity
		this.inputActions = [];
	},

	handleInput: function(e, data) 
	{
		var action = Game.Keymap.keyCodeToAction(data.keyCode); //TODO: data.which
		var fn = e + '-' + action;
		if (typeof this.inputActions[fn] == 'function')
		{
			this.inputActions[e + '-' + action]();
		}
	}
}