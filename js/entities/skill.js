/**
 * skill.js
 *
 * a skill useable by an entity: includes skill metadata and its effect
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var Skill = function(template, entity, eventEmitter) {
 	template = template || {};
	this.name     = template['name'];
	this.id       = undefined;

 	this._emitter = eventEmitter;
	this._entity  = entity;
	this._use     = template['onUse'];
	this._coefficients = template['coefficients'];

}

Skill.prototype = {
	select: function()
	{
		this._emitter.Event(this._entity.id, 'useSkill').publish(this._use);
	}
};

module.exports = Skill;