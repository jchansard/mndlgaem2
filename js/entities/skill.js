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
	this._select  = template['select'];

}

Game.Skill.prototype = {
	select: function()
	{
		this._select.apply(this._entity, arguments);
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
		select: function()
		{
			this.drawNewHand();
		}
}
