/**
 * skill.js
 *
 * a skill useable by an entity: includes skill metadata and its effect
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var Skill = function(template) {
 	template  = template || {};
	this.name = template.name;
	this.id   = template.id;

	// get info from skillbuilder template
	var skillInfo = template.onUse || {};
	this.effects      = skillInfo.effects;
	this.coefficients = skillInfo.coefficients;
	this.targeting    = skillInfo.targeting;

}

Skill.prototype = {

	// // called on use
	// use: function()
	// {
	// 	var targets = [];
	// 	this._emitter.Event(this._entity, 'getTargets').publish(this._targets, targets);
	// 	this._emitter.Event(this._entity, 'useSkill').publish(this._use.bind(this));
	// },

	// // loop through each effect and call its callback
	_use: function(modifierEffects, targets) {
		targets = this._targets;
		this._effects.forEach(function(effect, index)
		{
			var coefficients = this._coefficients[index];
			var target = targets[index];
			console.log(target);
			effect.forEach(function(effectFn, index) {
				effectFn(coefficients, modifierEffects, target);
			})
		}.bind(this));
	},
};



module.exports = Skill;