Game.EventEmitter = function() {
  this._events      = {};
}

Game.EventEmitter.prototype = 
{
  Event: function(type) 
  {
    if (type === undefined) { return; }
    var callbacks;
    var event = this._events[type];
    if (event === undefined)
    {
      callbacks = jQuery.Callbacks();
      event = {
        subscribe: callbacks.add,
        unsubscribe: callbacks.remove,
        publish: callbacks.fire
      };
      this._events[type] = event;
    }
    return event;
  },
}