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

 Game.Entity = function(template) {
 	this._glyph = new Game.Glyph(template.glyph)
	this._name = template['name'];
	this._x = template['x'] || 0;
	this._y = template['y'] || 0;
	this._map = null;
 }

 Game.Entity.prototype = {
 	draw: function(drawCallback, thisArg, drawArea) {
 		var g = this._glyph;
 		var drawInfo = {
 			x: this._x,
 			y: this._y,
 			ch: g.ch,
 			fg: g.fg,
 			bg: g.bg
 		};

 		// handle transparency by getting underlying tile's bg color
 		if (this._glyph.bg === 'transparent')
 		{
 			drawInfo.bg = this._map.getTile(this._x, this._y).glyph.bg;
 		}
 		drawCallback.call(thisArg, drawArea, drawInfo);
 	},

 	setPos: function(x, y)
 	{
 		this._x = x;
 		this._y = y;
 	},

 	setMap: function(map)
 	{
 		this._map = map;
 	}
 }