/**
 * entity.js
 *
 * entity prototype. entities include the playor actor, enemies, items, and 
 * basically anything in the world that's not a tile
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

 Game.Entity = function(template, eventEmitter) {
 	template = template || {};
 	this._emitter = eventEmitter;
 	this._glyph   = new Game.Glyph(template.glyph)
	this._name    = template['name'];
	this._x 	  = template['x'] || 0; //TODO: this is gross
	this._y 	  = template['y'] || 0;
	this._map 	  = null;

	this.id       = undefined;
 }

 Game.Entity.prototype = {
 	draw: function(drawCallback, thisArg) {
 		var g = this._glyph;
 		var drawInfo = {
 			ch: g.ch,
 			fg: g.fg,
 			bg: g.bg
 		};

 		// handle transparency by getting underlying tile's bg color
 		if (this._glyph.bg === 'transparent')
 		{
 			drawInfo.bg = this._map.getTile(this._x, this._y).glyph.bg;
 		}
 		drawCallback.call(thisArg, this._x, this._y, drawInfo);
 	},

 	useSkill: function(skillCallback)
 	{
 		skillCallback();
 	},

 	tryMove: function(x, y)
 	{
 		if (this.canMoveTo(x, y)) { this.moveTo(x, y); }
 	},

 	canMoveTo: function(x, y)
 	{
 		return this._map.isTraversable(x, y);
 	},

 	moveTo: function(x, y)
 	{
 		this._x = x;
 		this._y = y;
 	},

 	setMap: function(map)
 	{
 		this._map = map;
 	},

 	position: function() 
 	{
		return [this._x, this._y];
	}
 }