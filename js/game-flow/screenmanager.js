/**
 * screenmanager.js
 *
 * manager for screen objects
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
	
var ScreenManager = function(emitter, screens) {
	this._emitter = emitter;
	this._screens = screens;
}

ScreenManager.prototype = {
	init: function() {
		this._initListeners();
	},

	_initListeners: function() {
		var e = this._emitter;
		var getScreenHandler = this._getScreen.bind(this);

		e.Event('screen','getScreen').subscribe(getScreenHandler);
	},

	// returns screen with specified name via data object's screen parameter
	_getScreen: function(screenName, data)
	{
		data.screen = this._screens[screenName];
	}
}

var build = function(emitter, screens) {
	var screenManager = new ScreenManager(emitter, screens);
	screenManager.init();
	return screenManager;
}

module.exports.build = build;