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
const Glyph = require('../display/glyph.js');

var Entity = function(template, eventEmitter, gui) {
 	template = template || {};
 	this._emitter = eventEmitter;
 	this._events  = undefined;
 	this._gui     = gui;
 	this._glyph   = new Glyph(template.glyph)
	this.name    = template['name'];
	this._x 	  = template['x'] || 0; //TODO: this is gross
	this._y 	  = template['y'] || 0;
	this._map 	  = null;

	this.id       = undefined;
 }

Entity.prototype = {
 	draw: function(drawCallback) {
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
 		drawCallback(this._x, this._y, drawInfo);
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

 	// mode = returns array if true, object if falsey
 	position: function(mode) 
 	{
		return (mode) ? [this._x, this._y] : { x: this._x, y: this._y };
	},

	// apply skill + effects to targets
	_useSkillWithTargets: function(skill, modifierEffects, targets) {
		skill.effects.forEach(function(effect, index)
		{
			var coefficients = skill.coefficients[index];
			var target = targets[index];
			effect.forEach(function(effectFn, index) {
				effectFn(coefficients, modifierEffects, target);
			});
		});
	},
 }

 module.exports = Entity;