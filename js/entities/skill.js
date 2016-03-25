/**
 * skill.js
 *
 * a skill useable by an entity: includes skill metadata and its effect
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

Game.Skill = function(template, entity, eventEmitter) {
 	template = template || {};
	this.name     = template['name'];
	this.id       = undefined;

 	this._emitter = eventEmitter;
	this._entity  = entity;
	this._use     = template['onUse'];
	this._coefficients = template['coefficients'];

}

Game.Skill.prototype = {
	select: function()
	{
		this._emitter.Event(this._entity.id, 'useSkill').publish(this._use);
	}
};

/** PlayerAttack
 *  
 *  DESCRIPTION: Player attack skill. 
 *  ASSUMES: this._entity == player
 */
Game.Skill.PlayerAttack =
{
		name: 'Attack',
		id:   'player-attack',
		onUse: function(effects)
		{
			var pow = effects.power;

			console.log("you did " + pow + " damage!!");
		},
		coefficients: [2]
}
