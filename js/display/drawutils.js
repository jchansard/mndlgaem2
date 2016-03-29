/**
 * drawutils.js
 *
 * utils for drawing to canvas
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

module.exports = {

	// clears part of the screen. unused currently.
	clearPartOfScreen: function(display, scr, position, size, bg)
	{
		var drawInfo = { fg: bg, bg: bg, ch:' ' };

		for (var y = position.y; y < position.y + size.height; y++)
		{
			for (var x = position.x; x < position.x + size.width; x++)
			{
				display.draw(scr, x, y, drawInfo);
			}
		}
	},

	draw: function(x, y, drawInfo) {
		layer = drawInfo.layer || 0;

		// draw text if text is passed; else draw glpyh
		if (drawInfo.text !== undefined)
		{
			this._drawText(x, y, layer, drawInfo.text, drawInfo.maxWidth);
		}
		else if (drawInfo.type === 'border')
		{
			this._drawBorder({ x: x, y: y}, drawInfo.size, drawInfo.options);
		}
		else
		{
			this._drawGlyph(x, y, layer, drawInfo.ch, drawInfo.fg, drawInfo.bg);
		}
	},

	_drawGlyph: function(x, y, layer, ch, fg, bg)
	{
		this._displays[layer].draw(x, y, ch, fg, bg);
	},
	
	_drawText: function(x, y, layer, text, maxWidth) 
	{   // TODO: ALLOW LINE BY LINE (ARRAY TEXT)
		this._displays[layer].drawText(x, y, text, maxWidth);
	},

	_drawToCanvas: function(id, drawInfo) {
		var mult = Game.CANVASTILESIZE || 12;
		var x = drawInfo.x || 0; 
		var y = drawInfo.y || 0;
		drawInfo.type = drawInfo.type || 'image';
		x *= mult;
		y *= mult;
		var canvas = $(id).get(0).getContext('2d');

		switch(drawInfo.type) {
			case 'image':
				var img = new Image();
				img.src = drawInfo.src; //TODO: preload!!!!!!!!
				img.addEventListener("load", function() {
					canvas.drawImage(img, x, y);
				});
				break;
			case 'text':
				y += mult; // for text, x,y = bottom left, apparently (for images it's top left?) this way, coordinates are consistent
				canvas.font = drawInfo.font || "12px inconsolata";
				canvas.fillStyle = drawInfo.color || "white";
	  			canvas.fillText(drawInfo.text, x, y);
	  			/*var x = 2;
	  			var timer = setInterval(function() {
	  				canvas.fillStyle = 'rgb(217,0,217)';
	  				canvas.fillRect(35, 107, x, 14);
	  				x += 2;
	  				if (x==160) {
	  					console.log(x);
	  					clearInterval(timer);
	  				}
	  			}, 50);*/
	  			break;
	  		default:
	  			console.err("invalid type passed to canvas: " + drawInfo.type);
	  	}
	},

	// draws a border around an area, and fills the background
	_drawBorder: function(position, size, options)
	{
		options = options 	    		|| {};
		var fg  = options.fg 			|| 'white';
		var bg  = options.bg  			|| 'rgba(20, 20, 40, 0.8)';
		var layer   = options.layer     || 0;
		var padding = options.padding 	|| 0;

		var borderPosition = { x: position.x, y: position.y };
		var borderSize = { w: size.width, h: size.height };

		// calculate new position and size based on padding
		if (padding > 0)
		{
			borderPosition.x -= padding;
			borderPosition.y -= padding;
			borderSize.h += (padding * 2);
			borderSize.w += (padding * 2);
		}

		var drawInfo = { fg: fg, bg: bg, layer: layer };
		var x = borderPosition.x;
		var y = borderPosition.y;

		// draw top left corner (┌)
		drawInfo.ch = '┌';
		this.draw(x, y, drawInfo)
		// draw top border (─)
		drawInfo.ch = '─';
		for (var i = 1; i < borderSize.w - 1; i++)
		{
			x++;
			this.draw(x, y, drawInfo);
		}
		// draw top right corner (┐)
		drawInfo.ch = '┐';
		x++;
		this.draw(x, y, drawInfo);
		// draw middle
		for (var row = 1; row < borderSize.h; row++)
		{
			y++;
			x = borderPosition.x;
			for (var col = 0; col < borderSize.w; col++)
			{
				if (col == 0 || col == (borderSize.w - 1)) { drawInfo.ch = '│'; }
				else { drawInfo.ch = ' '; }
				this.draw(x, y, drawInfo);
				x++;
			}
		}
		// draw bottom left corner (└)
		x = borderPosition.x;
		drawInfo.ch = '└';
		this.draw(x, y, drawInfo)
		// draw bottom border (─)
		drawInfo.ch = '─';
		for (var j = 1; j < borderSize.w - 1; j++)
		{
			x++;
			this.draw(x, y, drawInfo);
		}
		// draw bottom right corner (┘)
		drawInfo.ch = '┘';
		x++;
		this.draw(x, y, drawInfo);		
	}
}