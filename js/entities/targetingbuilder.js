/**
 * skillscripting.js
 *
 * entity skills
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
const self = 'self';
const INDIRECT = 0;
const DIRECT = 1;
const PLAYER = 2;
const NOLIMIT = -1;
const ALLDIRS = 'urdl'

const calc = require('../util/calc.js')

var TargetingBuilder = function() {
	// set defaults
	this._type = INDIRECT;
	this._numTargets = NOLIMIT;
	this._targetFunctions = [];
	this._offset = { x: 0, y: 0 };
	this.targetFilter  = function(tile) { return this._map.isTraversable(tile[0], tile[1]); };
	this.coefficients = [0, 0];
}

TargetingBuilder.prototype = {

	/* TARGETING TYPE */

	directly: function() {
		this._type = DIRECT;
		return this;
	},

	indirectly: function() {
		this._type = INDIRECT;
		return this;
	},

	player: function() {
		this._type = PLAYER;
		return this;
	},

	/* NUMBER OF TARGETS */

	// first target found. works best with lines. might be unpredictable with areas
	firstTarget: function() {
		this._numTargets = 1;
		return this;
	},

	// first n targets found
	nTargets: function(n) {
		this._numTargets = n;
		return this;
	},

	// all targets found
	allTargets: function() {
		this._numTargets = NOLIMIT;
	},

	/* TARGETING AREA FUNCTIONS */

	inLine: function(length) {
		this._addTargetFunction(this._inLine(length));
		return this;
	},

	_inLine: function(length) {
		var filter = this._isNotOrigin;

		return function(source, offset, directions, coefficients, modifierEffects) {
			directions = directions || ALLDIRS;

			var tiles = [];
			var x1 = source.x + offset.x;
			var y1 = source.y + offset.y;
			var origin = [x1, y1];
			var modifiedLength = length;

			if (coefficients[0] !== 0)
			{
				modifiedLength += Math.floor(modifierEffects.power / coefficients[0]);
			}

			directions.split("").forEach(function(dir, index) {
				var end = calc.getEndPoint(x1, y1, modifiedLength, dir);
				tiles.push(calc.getLine(x1, y1, end[0], end[1]).filter(filter(origin)));
			});
			return tiles;
		}
	},

	_isNotOrigin: function(origin) {
		return function(point) {	
			return !((origin[0] === point[0]) && (origin[1] === point[1]))
		}
	},

	inAllDirections: function() {
		this._directions = ALLDIRS;
		return this;
	},

	/* EFFECT MODIFIER FUNCTIONS */

	// sets power coefficient for current effect
	withPowerCoefficient: function(coefficient) {
		this.coefficients[0] = coefficient;
		return this;
	},

	// sets cdr coefficient for current effect
	withCDRCoefficient: function(coefficient) {
		this.coefficients[1] = coefficient;
		return this;
	},


	/* OTHER FUNCTIONS */

	fromOffset: function(x, y) {
		this._offset = { x: x, y: y };
		return this;
	},

	// just for sugar
	and: function() {
		return this;
	},

	/* helper functions */
	
	_addTargetFunction: function(targetFn) {
		this._targetFunctions.push(targetFn)	
		// console.log(this._targetFunctions[0]({x:1, y:1}));	
	},

	/* public functions */

	// calculates and returns all targeting choices for this targeting object
	targetChoices: function(source, modifierEffects) {

		var choices = [];
		var offset = this._offset;
		var directions = this._directions;
		var coefficients = this.coefficients;

		this._targetFunctions.forEach(function(fn) {
			var theseChoices = fn(source, offset, directions, coefficients, modifierEffects);
			theseChoices.forEach(function(value, index) {
				if (choices[index]) { choices[index].push(value); }
				else { choices[index] = value; }
			});
		});
		return choices;
	},

	getTargetsInTargetingArea: function(tiles, map)
	{
		var targets = map.getEntitiesInArea(tiles);

		return targets.slice(0, this._numTargets);
	}


}

var targets = function()
{
	return new TargetingBuilder();
}

module.exports = {
	targets: targets,

	melee: function() { return targets().firstTarget().inLine(1).inAllDirections().indirectly() },
}
