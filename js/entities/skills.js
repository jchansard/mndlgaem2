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

var skill =  require('./skillbuilder');

var skills = {
	PlayerAttack: {
		name: 'Attack',
		onUse: skill.does().damages(1).to('target').withPowerCoefficient(0.25)
	}
}

module.exports = skills;
