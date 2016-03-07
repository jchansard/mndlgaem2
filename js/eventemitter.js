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
Game.EventEmitter = function() {
  this._events      = {};
}

Game.EventEmitter.prototype = 
{
  Event: function(topic,type) 
  {
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
      callbacks = jQuery.Callbacks();
      event = {
        subscribe: callbacks.add,
        unsubscribe: callbacks.remove,
        publish: callbacks.fire
      };
      this._events[topic][type] = event;
    }
    return event;
  },
}