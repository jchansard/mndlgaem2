/**
 * card.js
 *
 * ui element representing a card in a deck
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.UIElements.Card = function(properties, gui, eventEmitter)
{
	properties = properties || {};
	Game.UIElements.UIElement.apply(this, arguments);

	this.boundCard = properties.card;
}

Game.UIElements.Card.extend(Game.UIElements.UIElement);
Game.Utils.extendPrototype(Game.UIElements.Card, {

	// draw the dialog; override this for different dialog types
	render: function() 
	{
		var card = this.boundCard;
		// don't draw blank cards
		if (card === undefined) { return; }

		var gui  = this._gui;

		Game.DrawUtils.drawBorder(gui, this.position, this.size);
		var pow = '%c{red}%s'.format(card.power);
		var cdr = '%c{lightblue}%s'.format(card.cdr);
		gui.drawText(this.position.x+1, this.position.y+1, { text: pow });
		gui.drawText(this.position.x + this.size.width-2, this.position.y + this.size.height-2, { text: cdr });

	},

	// get input events for this dialog
	getInputEvents: function() 
	{
		var card = this.boundCard;
		var inputEvents = {

		};
		return inputEvents;
	},

	// on click, if user clicked on a prompt option, choose that choice
	lclick: function(e) 
	{
		console.log('clicked');
		this.boundCard.select();
		return;
	},
});