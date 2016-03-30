/**
 * app.js
 *
 * entry point for app. supports -debug and -test flags
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */

var electron = require('electron');
var remote   = require('electron').remote;
var args  = process.argv.slice(2);
var debug = (args.indexOf('-debug') > -1) ? true : false;
var test  = (args.indexOf('-test') > -1) ? true : false;

electron.app.on('ready', function() {
	var width = (debug) ? 1228 : 992;
	var height = 650;
	var gameWindow = new electron.BrowserWindow({width: width, height: height, autoHideMenuBar: true });
	gameWindow.setMenuBarVisibility(false);
	var URL = 'file://' + __dirname;
	// if test flag is set, load index.html in test directory
	URL = (test) ? URL + '/test/index.html' : URL + '/index.html';

	gameWindow.loadURL(URL);

	// toggle dev tools by default if debug flag is set
	if (debug) { gameWindow.toggleDevTools() };
});