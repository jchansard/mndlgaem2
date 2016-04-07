/**
 * skills.js
 *
 * entity skills
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
/** PlayerAttack
 *  
 *  DESCRIPTION: Player attack skill. 
 *  ASSUMES: this._entity == player
 */

const does =  require('./skillbuilder').does;
const targets = require('./targetingbuilder').targets;
const targeting = require('./targetingbuilder');

var skills = {
	PlayerAttack: {
		name: 'Attack',
		onUse: does().damages(1).to(targeting.melee()).withPowerCoefficient(0.25).then().damages(5).to(targeting.melee()).withPowerCoefficient(0.5)
	}
}

module.exports = skills;
