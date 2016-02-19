/**
 * templatereader.js
 *
 * apply a simple object template to a class, e.g. apply mixins to an entity
 *
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
Game.TemplateReader = function() { };

Game.TemplateReader.prototype.applyTemplate = function(target, template) {
	template = template || {};
	target._properties = {};
	target._propertyGroups = {};
	target._events = {};
	var properties = template['properties'] || [];
	for (var i = 0; i < properties.length; i++) {
		for (var key in properties[i]) {
			if (key !== 'name' && key !== 'group' && key !== 'init' && key !== 'events' && !target.hasOwnProperty(key)) {
				target[key] = properties[i][key];
			} else if (key === 'name') {
				target._properties[properties[i][key]] = true;
			} else if (key === 'group') {
				target._propertyGroups[properties[i][key]] = true;
			}
		}
		if (properties[i].events !== undefined) {
			for (var key in properties[i].events) {	
				if (target._events[key] === undefined) {
					target._events[key] = [];
				}
				target._events[key].push(properties[i].events[key]);
			}
		}
		if (properties[i].init !== undefined) {
			properties[i].init.call(target, template);
		}
		target._properties[properties[i].name] = true;
	}
}