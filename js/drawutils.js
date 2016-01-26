/**
 * drawutils.js
 *
 * utils for drawing to canvas
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.DrawUtils = {

	// clears part of the screen. unused currently.
	clearPartOfScreen: function(display, scr, position, size, bg)
	{
		var drawInfo = { fg: bg, bg: bg, ch:' ' };

		for (var y = position.y; y < position.y + size.height; y++)
		{
			drawInfo.y = y;
			for (var x = position.x; x < position.x + size.width; x++)
			{
				console.log('clearing ' + x + ',' + y);
				drawInfo.x = x;
				display.draw(scr, drawInfo);
			}
		}
	},

	// draws a border around an area, and fills the background
	drawBorder: function(display, scr, position, size, options)
	{
		options = options 	    		|| {};
		var fg  = options.fg 			|| 'white';
		var bg  = options.bg  			|| 'rgba(20, 20, 40, 0.8)';
		var padding = options.padding 	|| 1;

		var borderPosition = { x: position.x, y: position. y };
		var borderSize = { w: size.width, h: size.height };

		// calculate new position and size based on padding
		if (padding > 0)
		{
			borderPosition.x -= padding;
			borderPosition.y -= padding;
			borderSize.h += (padding * 2);
			borderSize.w += (padding * 2);
		}

		var drawInfo = { x: borderPosition.x, y: borderPosition.y, fg: fg, bg: bg };

		// draw top left corner (┌)
		drawInfo.ch = '┌';
		display.draw(scr, drawInfo)
		// draw top border (─)
		drawInfo.ch = '─';
		for (var i = 1; i < borderSize.w - 1; i++)
		{
			drawInfo.x++;
			display.draw(scr, drawInfo);
		}
		// draw top right corner (┐)
		drawInfo.ch = '┐';
		drawInfo.x++;
		display.draw(scr, drawInfo);
		// draw middle
		for (var row = 1; row < borderSize.h; row++)
		{
			drawInfo.y++;
			drawInfo.x = borderPosition.x;
			for (var col = 0; col < borderSize.w; col++)
			{
				if (col == 0 || col == (borderSize.w - 1)) { drawInfo.ch = '│'; }
				else { drawInfo.ch = ' '; }
				display.draw(scr, drawInfo);
				drawInfo.x++;
			}
		}
		// draw bottom left corner (└)
		drawInfo.x = borderPosition.x;
		drawInfo.ch = '└';
		display.draw(scr, drawInfo)
		// draw bottom border (─)
		drawInfo.ch = '─';
		for (var j = 1; j < borderSize.w - 1; j++)
		{
			drawInfo.x++;
			display.draw(scr, drawInfo);
		}
		// draw bottom right corner (┘)
		drawInfo.ch = '┘';
		drawInfo.x++;
		display.draw(scr, drawInfo);		
	}
}