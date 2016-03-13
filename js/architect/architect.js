/**
 * architect.js
 *
 * builds, stores, and tracks levels for a game instance
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
 Game.Architect = function(properties, player) {
	properties 			= properties || {};
	this._levelMap 		= [];
	this._currentLevel 	= undefined;
	this._player 		= player;
}

Game.Architect.prototype = {
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
		levelType  = levelType || Game.Architect.testDungeon;
		var width  = levelType.width;
		var height = levelType.height;
		var tiles  = Game.ArchitectUtils.create2DArray(width, height);
		var mapBuilder = new levelType.mapType(width, height);
		var callbackContext, callback;

		if (typeof levelType.mapTypeCallback === 'function')
		{
			callbackContext = {	properties: levelType, tiles: tiles };
			callback = levelType.mapTypeCallback.bind(callbackContext);
			mapBuilder.create(callback);		
		}

		var map = new Game.Map(tiles);
		if (typeof levelType.init === 'function') { levelType.init.call(map); }

		return map;
	}
}

Game.Architect.testDungeon = {
	width: 40,
	height: 20,

	floorTile: Game.Tile.dungeonFloor,
	wallTile: Game.Tile.dungeonWall,

	mapType: ROT.Map.Arena,
	mapTypeCallback: Game.ArchitectUtils.floorOrWall,

	init: function() 
	{
		//this.addEntity(Game.gameShell.player);
	}
};