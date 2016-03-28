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

var skills = {
	PlayerAttack:
	{
		name: 'Attack',
		id:   'player-attack',
		onUse: function(effects)
		{
			var pow = (effects.power/5)>>0;

			console.log("you did " + pow + " damage!!");
		},
		coefficients: [2]
	}
}

module.exports = skills;
