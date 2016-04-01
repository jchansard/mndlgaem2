/**
 * skillscripting.js
 *
 * entity skills
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
var self = 'self';

var SkillBuilder = function() {
	this._index = 0;
	this._and = false;
	this.effects = [];
	this.coefficients  = [];
	this.targets = [];
}

SkillBuilder.prototype = {

	/* EFFECT FUNCTIONS */

	// deals damage to target
	damages: function(base) {
		var effectFn = function(coefficients, modifierEffects, target)
		{
			var total = base + coefficients[0] * modifierEffects.power;
			console.log(target + ' takes ' + total);
		}
		this._addEffect(effectFn);
		return this;
	},

	// stuns target
	stuns: function(base) {
		var effectFn = function(coefficients, modifierEffects, target)
		{
			var total = base + coefficients[0] * modifierEffects.power;
			console.log(target + ' stunned for ' + total);
		}
		this._addEffect(effectFn);
		return this;
	},

	/* EFFECT MODIFIER FUNCTIONS */

	// sets power coefficient for current effect
	withPowerCoefficient: function(coefficient) {
		this.coefficients[this._index][0] = coefficient;
		return this;
	},

	// sets cdr coefficient for current effect
	withCDRCoefficient: function(coefficient) {
		this.coefficients[this._index][1] = coefficient;
		return this;
	},

	// sets target for current effect
	to: function(target) {
		target = target || self;
		this.targets[this._index] = target;
		return this;
	},

	// adds a new effect function to current effect. 
	// nb: it must use the same target and coefficients.
	and: function() {
		this._and = true;
		return this;
	},

	// adds a new effect to the skill; can have new target and coefficient
	then: function() {
		this._index++;
		return this;
	},

	// adds effect 
	_addEffect: function(effectFn) {

		this._initEffectsTargetsAndCoeffs(this._index);

		if (this._and) {
			this._and = false;
			this.effects[this._index].push(effectFn);
		}
		else {
			this.effects[this._index][0] = effectFn;
		}		
	},

	_initEffectsTargetsAndCoeffs: function(index) {
		this.effects[index]      = (!this.effects[index])      ? []     : this.effects[index];
		this.coefficients[index] = (!this.coefficients[index]) ? [0, 0] : this.coefficients[index];
		this.targets[index]      = (!this.targets[index])      ? self   : this.targets[index];
	}
}

var build = function()
{
	return new SkillBuilder();
}

module.exports.does = build;