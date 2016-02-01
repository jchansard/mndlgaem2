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
		var mainMenu = new Game.Dialog({
			//title:		"mndlgaem2",
			options: 	["New Game", "Load Game"],
			position: 	{ x: 19, y: 10 },
			callback:   function(choice) { console.log('hey ' + choice); } 
		})
		Game.thisGame.guis['ui'].addDialog(mainMenu);
    },
    render: function() {
        // TODO: make this purdy
        this.drawText('full',{ x: 19, y: 7, text: "%c{blue}mndlgaem2" });
       // this.drawText('full',{ x: 19, y: 11, text: "%c{lightblue}press enter" });	
    },
    exit: function() {
		// still nbd
	},

	inputEvents: {},

    handleInput: function(type, data) {
        // go to main game screen if enter is pressed
        if (type === 'keydown') {
            var inputEvent = Game.Keymap.keyCodeToFunction(data.keyCode);
            if (inputEvent && this[inputEvent]) { this[inputEvent](); }
        }
    }
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
	_player: null,
	_subscreen: null,
	_buttons: [],
	enter: function() {
		this._player = new Game.Entity(Game.PlayerActor);
		this.initButtons();
		var numLevels = 1;
		var width = 300;
		var height = Game.display.getScreenHeight('play');
		var map = new Game.Map.Forest(numLevels,width,height,this._player);
		map.getEngine().start();
		
		Game.display.draw('info', {type: 'text', x: 3.9, y: 1, font: '16px inconsolata', color: 'rgb(64,0,0)', text: '█'});
		Game.display.draw('info', {type: 'text', x: 4.2, y: 1, font: '16px inconsolata', color: 'white', text: 'Z'});
		Game.display.draw('info', {type: 'text', x: 8.8, y: 1, font: '16px inconsolata', color: 'rgb(64,0,0)', text: '█'});
		Game.display.draw('info', {type: 'text', x: 9.1, y: 1, font: '16px inconsolata', color: 'white', text: 'X'});
		//Game.display.draw('info', {type: 'text', x: 9.2, y: 1, font: '16px inconsolata', text: 'X'});
		//Game.display.draw('info', {type: 'text', x: 10.2, y: 1, font: '16px inconsolata', text: ']'});
		
		//Game.display.drawASCII('info', 0, 0, AMMO);
		//Game.display.drawASCII('info',0,20, AMMO);
	},
	render: function(display) {
		/*
		var f, g;
		$.get("assets/ascii/flashlightflat", function(data) { saveFile(data); });
		function saveFile(data) {
			f = data;
			g = new Uint8Array(data);
			console.log(g);
		}

		function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, true);  
    rawFile.responseType = 'arraybuffer';
    rawFile.onload = function (response)
    {
      var words = new Uint8Array(rawFile.response);
       console.log(words[1]);
      words = pako.inflate(words);
      console.dir(words);
      console.log(words.toString());

    };
    rawFile.send();
}

    readTextFile("assets/ascii/flashlight.xp");*/
    
    	/*Game.display.drawASCII('info', 0, 0, FLASHLIGHT); 
    	Game.display.drawASCII('info', 0, 3, AMMO);
    	Game.display.drawASCII('action',50,0,INFO);*/
    
		if (this._subscreen) {
			this._subscreen.render(display);
			return;
		}
		var map = this._player.getMap();
		var actions = this._player.getNumActions() || 3;
		var skills = this._player.getSkills();  //TODO: get button key
		var icons = '';
		this.drawTiles(display,map);
		for (var i = 0; i < 3; i++) {
			if (actions > i) {
				icons += '%c{#77F}▐▌';
			}
			else {
				icons += '%c{#009}▐▌';
			}
		}
		/*display.drawText('play',1,36,'actions:' + icons);
		for (var i = 1; i <= 12; i++) {
			if (this._player.getNumShots() >= i) {
				display.draw('info', 10 + (i*2), 4, '▀', 'yellow', 'red');
			} else {
				break;
			}
		}*/	
		var batlife = skills[3].getAmmo();
		/*for (var i = 0; i < batlife; i += 10) {
			var fg;
			if (batlife > 50) { fg = 'green'; }
			else if (batlife > 25) { fg = 'yellow'; }
			else { fg = 'red'; }
			display.draw('info_flashlight', 13 + (i/10), 0, '█', fg, 'black');
		}
		display.drawText('info_flashlight', 0, 0, 'flashlight: [');
		display.drawText('info_flashlight', 34, 0,']');
		display.drawText('info', 1, 4,'bullets: ');
		
		this.drawButtons('action',1, 0);*/ 
	},
	handleInput: function(type, data) {	
		if (this._subscreen) {
            this._subscreen.handleInput(type,data);
            return;
        }
		if (type === 'keydown') {
			this._keymap.handleKey(data.keyCode,this);
		}    
	},
	initButtons: function() {
		var skills = this._player.getSkills();
		var keys = ['Z','X','C','V'];				//TODO: don't hardcode
		for (var i = 0; i < skills.length; i++) { 	//TODO: passives??
			var caption = skills[i].getName();
			this._buttons.push(new Game.ScreenButton({
				caption: caption + '(' + keys[i] + ')',
				FGColor: 'white',
				BGColor: 'darkslateblue',
				buttonLength: 18,
				action: Game.ScreenButton.ButtonUseSkill
			},{
				context: 'mainScreen',
				skill: skills[i]
			}));
		}
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
	drawButtons: function(area, x, y) {
		var buttons;
		if (this._subscreen && this._subscreen.getButtons() !== undefined) {
			buttons = this._subscreen.getButtons();
		} else {
			buttons = this._buttons;
		}
		var prevX = 0;
		for (var i = 0; i < buttons.length; i++) {			
			if (buttons[i] !== undefined) {
				prevX += (i > 0) ? buttons[i-1].getButtonLength() : 0;
				buttons[i].draw(area, x + prevX , y);
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
    }
};
