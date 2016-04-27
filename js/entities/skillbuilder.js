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
	this.targeting = [];
}

SkillBuilder.prototype = {

	/* EFFECT FUNCTIONS */

	// deals damage to target
	damages: function(base) {
		this._addEffect(this._damages(base)); //todo NOP
		return this;
	},

	_damages: function(base)
	{
		return function(coefficients, modifierEffects, target)
		{
			var total = base + coefficients[0] * modifierEffects.power;
			console.log(target.name + ' takes ' + total);			
		}	
	},

	// stuns target
	stuns: function(base) {
		this._addEffect(this._stuns(base));
		return this;
	},

	_stuns: function(base)
	{
		return function(coefficients, modifierEffects, target) 
		{
			var total = base + coefficients[0] * modifierEffects.power;
			console.log(target + ' stunned for ' + total);
		}
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
	to: function(targeting) {
		targeting = targeting || self;
		this.targeting[this._index] = targeting;
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
		this.targeting[index]    = (!this.targeting[index])    ? self   : this.targeting[index];
	}
}

var build = function()
{
	return new SkillBuilder();
}

module.exports.does = build;