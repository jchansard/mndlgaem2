/**
 * eventemitter.js
 *
 * given an event type, executes listeners' callbacks
 *
 * use: EventEmitter.Event('event1').subscribe(myFn);
 *      EventEmitter.Event('event1').publish(args);
 *      EventEmitter.Event('event1').unsubscrube(myFn);
 * -------------
 * Josh Chansard 
 * https://github.com/jchansard/mndlgaem2
 */
var mndlEventEmitter = function() {
  this._events      = {};
}

mndlEventEmitter.prototype = 
{
  Event: function(topic,type) 
  {
    var $ = require('jquery');
    // if no type is passed, assume topic is global and topic is type
    if (type === undefined) 
    { 
      type = topic;
      topic = 'global'; 
    }
    var callbacks;
    var event;

    // create topic if hasn't been subscribed to before
    if (this._events[topic] === undefined)
    {
      this._events[topic] = {};
    }
    event = this._events[topic][type];
    if (event === undefined)
    {
      callbacks = $.Callbacks();
      event = {
        subscribe: callbacks.add,
        unsubscribe: callbacks.remove,
        publish: callbacks.fire
      };
      this._events[topic][type] = event;
    }
    return event;
  },

  // the following functions take an array of events:
  // [[topic1, type1, arguments1], [topic2, type2, arguments2]]...
  subscribeEnMasse: function(events) 
  {
    this._handleMultipleEvents('subscribe', events);
  },

  unsubscribeEnMasse: function(events)
  {
    this._handleMultipleEvents('unsubscribe', events);
  },

  publishEnMasse: function(events)
  {
    this._handleMultipleEvents('publish', events);
  },

  _handleMultipleEvents: function(mode, events)
  {
    events = events || [];
    events.forEach(function(event) {
      this.Event(event[0], event[1])[mode](event[2]);
    }.bind(this))
  }
}

module.exports = mndlEventEmitter;