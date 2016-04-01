/**
 * skill.js
 *
 * a skill useable by an entity: includes skill metadata and its effect
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var Skill = function(template, entityID, eventEmitter) {
 	template  = template || {};
	this.name = template.name;

	// get info from skillbuilder template
	var skillInfo = template.onUse || {};
	this._effects      = skillInfo.effects;
	this._coefficients = skillInfo.coefficients;
	this._targets      = skillInfo.targets;

	this._entity  = entityID;
	this._emitter = eventEmitter;

}

Skill.prototype = {

	// called on use
	use: function()
	{
		this._emitter.Event(this._entity, 'useSkill').publish(this._use.bind(this));
	},

	// loop through each effect and call its callback
	_use: function(modifierEffects) {
		this._effects.forEach(function(effect, index)
		{
			var coefficients = this._coefficients[index];
			var target = this._targets[index];
			effect.forEach(function(effectFn, index) {
				effectFn(coefficients, modifierEffects, target);
			})
		}.bind(this));
	},
};



module.exports = Skill;