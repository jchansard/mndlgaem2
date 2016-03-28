var electron = require('electron');
var remote   = require('electron').remote;
var debug = process.argv[2] || false;

electron.app.on('ready', function() {
	var mainWindow = new electron.BrowserWindow({width: 1228, height: 650});
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	if (debug) { mainWindow.toggleDevTools() };
});


// window.$ = window.jQuery = require('jQuery');