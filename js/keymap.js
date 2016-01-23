Game.Keymap = {
	init: function() {	
		this._actions = [];
		this._actions[ROT.VK_NUMPAD1] 	= 'downleft';
		this._actions[ROT.VK_NUMPAD2] 	= 'down';
		this._actions[ROT.VK_NUMPAD3] 	= 'downright';
		this._actions[ROT.VK_NUMPAD4] 	= 'left';
		this._actions[ROT.VK_NUMPAD5] 	= 'rest';
		this._actions[ROT.VK_NUMPAD6] 	= 'right';
		this._actions[ROT.VK_NUMPAD7] 	= 'upleft';
		this._actions[ROT.VK_NUMPAD8] 	= 'up';
		this._actions[ROT.VK_NUMPAD9] 	= 'upright';
		this._actions[ROT.VK_UP] 		= 'up';
		this._actions[ROT.VK_RIGHT] 	= 'right';
		this._actions[ROT.VK_LEFT] 	= 'left';
		this._actions[ROT.VK_DOWN] 	= 'down';
		this._actions[ROT.VK_1]		= 'test';
		this._actions[ROT.VK_RETURN]  	= 'select';
		this._actions[ROT.VK_ESCAPE]   = 'esc';
		this._actions[ROT.VK_Z]		= 'button1';
		this._actions[ROT.VK_X]		= 'button2';
		this._actions[ROT.VK_C]		= 'button3';
		this._actions[ROT.VK_V]		= 'button4';

		this._keys = [];
		this._keys['downleft'] 	= [ROT.VK_NUMPAD1];
		this._keys['down'] 		= [ROT.VK_NUMPAD2, ROT.VK_DOWN];
		this._keys['downright'] = [ROT.VK_NUMPAD3];
		this._keys['left']		= [ROT.VK_NUMPAD4, ROT.VK_LEFT];
		this._keys['rest']		= [ROT.VK_NUMPAD5];
		this._keys['right']		= [ROT.VK_NUMPAD6, ROT.VK_RIGHT];
		this._keys['upleft']	= [ROT.VK_NUMPAD7];
		this._keys['up']		= [ROT.VK_NUMPAD8, ROT.VK_UP];
		this._keys['upright']	= [ROT.VK_NUMPAD9];
		this._keys['select']	= [ROT.VK_RETURN];
		this._keys['cancel']	= [ROT.VK_ESCAPE];
		this._keys['button1']	= [ROT.VK_Z];
		this._keys['button2']	= [ROT.VK_X];
		this._keys['button3'] 	= [ROT.VK_C];
		this._keys['button4']	= [ROT.VK_Z];
	},

	actionToKeyCode: function(action)
	{
		return this._keys[action];
	},

	keyCodeToAction: function(keyCode)
	{
		return this._actions[keyCode];
	}
} 
