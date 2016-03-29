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
const levels  = require('./levels')

var Architect = function(properties, player) {
	properties 			= properties || {};
	this._levelMap 		= [];
	this._currentLevel 	= undefined;
	this._player 		= player;
}

Architect.prototype = {
	init: function()
	{
		this._levelMap.push(this._generateNewLevel())
		this._currentLevel = 0;
		this.currentMap().addEntity(this._player);
	},

	currentMap: function()
	{
		return this._levelMap[this._currentLevel];
	},

	_generateNewLevel: function(levelType) 
	{
		levelType  = levelType || levels.testDungeon;
		var width  = levelType.width;
		var height = levelType.height;
		var tiles  = this._create2DArray(width, height);
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
	},

	_create2DArray: function(width, height, initialValue)
	{
		initialValue = initialValue || undefined; 
		var arr = new Array(width);
		for (var x = 0; x < width; x++)
		{
			arr[x] = new Array(height);
			if (initialValue)
			{
				for (var y = 0; y < height; y++)
				{
					arr[x][y] = initialValue;
				}
			}
		}
		return arr;
	}
}

var build = function(properties, player) 
{
	return new Architect(properties, player);
}

module.exports.build = build;