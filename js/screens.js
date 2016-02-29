/**
 * screens.js
 *
 * build, render, teardown, and input for different game screens/states
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.Screens = {}; 

// starting screen menu
Game.Screens.startScreen = {
	enter: function() { 
		var mainMenu = {
			title:		"mndlgaem2",
			options: 	["New Game", "Load Game"],
			position: 	{ x: 18, y: 10 },
			style:      { padding: 1 },
			callback:   function(choice) { 
				switch(choice)
				{
					case 0: 
						this.gameShell.guis['ui'].changeScreen(Game.Screens.gameScreen);
						break;
				}
			}.bind(this) // this = calling gui
		}
		Game.gameShell.guis['ui'].addElement(Game.UIElements.MenuPrompt, mainMenu, 'full');
    },
    render: function() {
        this.drawText('full', 19, 7, { text: "%c{blue}mndlgaem2" });
    },
    exit: function() {
		this.clearAllElements();
	},
};

// win screen
Game.Screens.winScreen = {
	enter: function() { 
    	return;
    },
    render: function(display) {
    	
        // TODO: make this purdy
        display.drawText('full', 55,15, "%c{blue}WOOOOOHOOOOO");
        display.drawText('full', 55,16, "%c{lightblue}hey you won!");
    },
    handleInput: function(type, data) {
        // go to main game screen if enter is pressed
        if (type === 'keydown') {
            if (data.keyCode === ROT.VK_RETURN) {
                Game.changeScreen(Game.Screen.startScreen);
            }
        }
    }
};

// gameplay screen. TODO: update for mndlgaem2
Game.Screens.gameScreen = {

	enter: function() {
		var mapTerminal = {
			position: { x: 0, y: 0 },
			size: 'fill',
            player: this.gameShell.player, // TODO: ew
            map: this.gameShell.architect.currentMap()

		};

		Game.gameShell.guis['ui'].addElement(Game.UIElements.MapTerminal, mapTerminal, 'mapterminal');
	},
	render: function(display) {
		return;
	},

    drawTiles: function(display) {
    	//get stuff to make it easier to work with
    	var player = this._player;
    	var map = player.getMap();
    	var l = player.getLevel();
    	var tiles = map.getTiles();
    	var actors = map.getActors();
    	var otherEntities = map.getEntities();
    	var PCEntities = map.getPCEntities();
    	var playAreaWidth = Game.display.getScreenWidth('play');
    	var playAreaHeight = Game.display.getScreenHeight('play');
    	
		map.resetVisibleTiles();
        // add all visible tiles to hashmap
        map.getFOV(player.getLevel()).compute(player.getX(), player.getY(), player.getSightRadius(), map.computePlayerFOV.bind(map));
        for (var i = 0; i < PCEntities.length; i++) {
        	PCEntities[i].reactToEvent('calculateFOV',display);
        }
        //player.reactToEvent('calculateFOV');
    	//get the leftmost x coordinate to draw in order to center the player since our map is wider than the screen 
    	var leftmostX = this.getScreenOffsets('play').x;
    	
    	//draw them tiles
    	for (var x = leftmostX; x < playAreaWidth + leftmostX; x++) {
    		for (var y = 0; y < Math.min(map.getHeight(),playAreaHeight); y++) {
    			var glyph = tiles[l][x][y];
    			var fg,bg,character;
    			if (map.isTileExplored(l,x,y)) {
	    			if (map.getVisibleTiles().get(x,y)) {
	    				if (actors.get(l,x,y)) {
		    				glyph = map.getActor(l,x,y);
	    				} else if (otherEntities.get(l,x,y)) {
	    					glyph = map.getEntitiesAt(l,x,y)[0]; //TODO: FIFO?
	    				}
		    			fg = glyph.getFGColor();
			    		bg = glyph.getBGColor();
						character = glyph.getChar();
						if (bg === 'none') {
							bg = tiles[l][x][y].getBGColor();
						}
						if (fg === 'none') {
							fg = tiles[l][x][y].getFGColor();
						}
			    		if (character === 'none') {
			    			character = tiles[l][x][y].getChar();
			    		}
		    			var closestLightSource = player, distance1 = map.getDistanceBetween(x,y,player.getX(),player.getY());
		    			for (var i = 1; i < PCEntities.length; i++) {
		    				var distance2 = map.getDistanceBetween(x,y,PCEntities[i].getX(),PCEntities[i].getY());
		    				if (distance2 < distance1) { 
		    					distance1 = distance2;
		    					closestLightSource = PCEntities[i];
		    				}
		    			}
		    			if (!(x === closestLightSource.getX() && y === closestLightSource.getY())) {
		    				var interp = 1/(2*map.getDistanceBetween(x,y,closestLightSource.getX(),closestLightSource.getY())) + 0.5;
		    				fg = ROT.Color.toHex(ROT.Color.interpolate([0,0,0],ROT.Color.fromString(fg),interp));
		    				bg = ROT.Color.toHex(ROT.Color.interpolate([0,0,0],ROT.Color.fromString(bg),interp));
		    			}
	    			} else {
	    				fg = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(glyph.getFGColor()),[0,0,0],0.5));
	    				bg = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(glyph.getBGColor()),[0,0,0],0.8));
	    				character = glyph.getChar();
	    			}
	    			display.draw('play',{ x: x-leftmostX, y: y, ch: character, fg: fg, bg: bg });
    			}
    		}
    	}
    },

    getScreenOffsets: function(scr) {
    	var map = this._player.getMap();
    	//but make sure that we don't display offscreen tiles if the player is close to the left border
    	var leftmostX = Math.max(0,this._player.getX() - (Game.display.getScreenWidth(scr)/2));
    	//and make sure that we don't display offscreen tiles if the player is close to the right border
    	leftmostX = Math.min(leftmostX, map.getWidth() - Game.display.getScreenWidth(scr));
    	var topmostY = Math.max(0,this._player.getY() - (Game.display.getScreenHeight(scr)/2));
    	topmostY = Math.min(topmostY, map.getHeight() - Game.display.getScreenHeight(scr));
    	return {x: leftmostX, y:topmostY};
    },
    getPlayer: function() {
    	return this._player;
    },
    getButtons: function(i) {
    	if (typeof i === 'number') {
    		return this._buttons[i];
    	} else {	
    		return this._buttons; 
    	}
    },
    setSubscreen: function(subscreen) {
    	this._subscreen = subscreen;
    },

    exit: function() {
    	return;
    }
};
