/**
 * architect.js
 *
 * builds, stores, and tracks levels for a game instance
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

const GameMap = require('./map');
const levels  = require('./levels');
const create2DArray = require('../util/create2Darray');

var Architect = function(properties, eventEmitter, player) {
	properties 			= properties || {};
	this._levelMap 		= [];
	this._currentLevel 	= undefined;
	this._emitter       = eventEmitter;
	this._events        = undefined;
	this._player 		= player;
}

Architect.prototype = {
	init: function()
	{
		this._levelMap.push(this._generateNewLevel())
		this._currentLevel = 0;
		this.currentMap().addEntity(this._player);
		this._initListeners();
	},

	_initListeners: function() {
		var e = this._emitter;
		var currentMapHandler = this.currentMap.bind(this);
		this._events = [['architect', 'currentMap', currentMapHandler]];

		e.subscribeEnMasse(this._events);
	},

	currentMap: function(returnObject)
	{
		var map = this._levelMap[this._currentLevel];
		if (returnObject) { returnObject.data = map }
		return map;
	},

	_generateNewLevel: function(levelType) 
	{
		levelType  = levelType || levels.testDungeon;
		var width  = levelType.width;
		var height = levelType.height;
		var tiles  = create2DArray(width, height);
		var mapBuilder = new levelType.mapType(width, height);
		var callbackContext, callback;

		if (typeof levelType.mapTypeCallback === 'function')
		{
			callbackContext = {	properties: levelType, tiles: tiles };
			callback = levelType.mapTypeCallback.bind(callbackContext);
			mapBuilder.create(callback);		
		}

		var map = new GameMap(tiles);
		if (typeof levelType.init === 'function') { levelType.init.call(map); }

		return map;
	}
}

var build = function(properties, eventEmitter, player) 
{
	var architect = new Architect(properties, eventEmitter, player);
	architect.init();
	return architect;
}

module.exports = Architect;
module.exports.build = build;