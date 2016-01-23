var Game =  {
	init: function() {
		// constants
		this.CANVASTILESIZE = 12;
		
		// init input
		Game.InputManager.init();

        // create display objects
        var screens = [];
    	//screens['play'] = {	x: 0, y: 0,	width: 120,	height: 38 };
    	// screens['play'] = {	x: 0, y: 0,	width: 50,	height: 19 };
    	// screens['info'] = {	x: 0, y: 0, width: 19, height: 12, canvasID: '#gameinfo'};
    	// screens['info_panic'] = { x: 3, y: 9, width: 13, height: 1, canvasID: '#gameinfo'};
    	// screens['info_eq1'] = { x: 2, y: 2, width: 5, height: 6, canvasID: '#gameinfo'};
    	// screens['info_eq2'] = { x: 7, y: 2, width: 5, height: 6, canvasID: '#gameinfo'};
    	// screens['info_eq3'] = { x: 12, y: 2, width: 5, height: 6, canvasID: '#gameinfo'};
    	//screens['info_flashlight'] = {x : 122, y: 1, width: 38, height: 1};
    	//screens['action'] = { x: 0,	y: 38, width: 160, height: 12 };
    	//screens['full'] = {	x: 0, y: 0,	width: 160,	height: 50 };
    	screens['full'] = {	x: 0, y: 0,	width: 60, height: 20 };
    	
        //this.display = new Game.Display({width: 160, height: 50}, screens);
                this.player = { butt: function() {console.log('butt');} };
        this.ui = new Game.UserInterface({width: 50, height: 20}, screens, '#game');
        this.ui.changeScreen(Game.Screens.startScreen);



		// this.display.draw('info', {type:'image', src:'assets/ascii/info.png'});
		
		// setTimeout(function() {Game.display.draw('info_eq1', {src:'assets/ascii/eq_gun.png'});},1000);
		// setTimeout(function() {Game.display.draw('info_eq2', {src:'assets/ascii/eq_flash_off.png'});},1000);
		// setTimeout(function() {Game.display.draw('info_eq3', {src:'assets/ascii/eq_machete.png'});},1000);
		
		/*var queue = new ROT.EventQueue();
		queue.add(function() { alert('hey'); }, 300);
		queue.add(function() { alert('howdy'); }, 250);
		queue.get()();
		console.log(queue.getTime());*/

        /*
        this.playScreen = new Game.Display({width: 120, height: 38});
        this.infoScreen = new Game.Display({width: 40, height: 38});
        this.actionScreen = new Game.Display({width: 160, height: 12});
        this.fullScreen = new Game.Display({width: 160, height: 50});
        */
    },
};

$(document).ready(function() {
		Game.init();     

        /*$('#play').append(Game.playScreen.getDisplay().getContainer());
        $('#info').append(Game.infoScreen.getDisplay().getContainer());
        $('#action').append(Game.actionScreen.getDisplay().getContainer());
		$('#fullscreen').append(Game.fullScreen.getDisplay().getContainer());*/
});    