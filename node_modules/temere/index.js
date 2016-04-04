//var PIN = module.exports = function(seed, includeDashes){

// Based off the work of STEPHEN K. PARK AND KEITH W. MILLER
// See the PDF in the reference folder

var Rand = function(seed){
  var self = this, _seed;
  self.seed = function(seed) {
    if(seed === void 0){
      return _seed;
    }else{
      if(typeof(seed)==='string'){
        var i, l = seed.length;
        _seed = 0;
        for(i=0; i<l; i++){
          _seed += (seed.charCodeAt(i) ^ i);
        }
      }else{
        _seed = seed;
      }
      return self;
    }
  };
  self.seed(seed);
  self.next = function(){
    var hi = _seed / self.Q
    var lo = _seed % self.Q
    var test = self.A * lo - self.R * hi;
    if (test > 0) {
      _seed = test
    }
    else {
      _seed = test + self.M
    }
    return (_seed * self.oneOverM)
  }
  self.A = 48271;
  self.M = 2147483647;
  self.Q = self.M / self.A
  self.R = self.M % self.A
  self.oneOverM = 1.0 / self.M
  return self;
};

var Temere = module.exports = function(options){
  var self = this;
  var d = new Date();
  options = self.options = options || {};
  options.chars = options.chars || '23456789abcdfghkmnpqrstuvwxyz';
  options.length = options.length || 10;
  options.seed = options.seed || (2345678901 + (d.getSeconds() * 0xFFFFFF) + (d.getMinutes() * 0xFFFF));
  self.rand = new Rand(options.seed);
};

Temere.prototype.Rand = Rand;

Temere.prototype.seed = function(seed){
  var self = this;
  if(seed === void 0){
    return self.rand.seed();
  }else{
    self.options.seed = seed;
    self.rand.seed(self.options.seed);
    return self;
  }
};

Temere.prototype.reset = function(){
  var self = this;
  self.rand.seed(self.options.seed);
};

Temere.prototype.next = function(){
  var self = this;
  return self.toBaseString(self.rand.next()*(Math.pow(2, 36) - 1));
};

Temere.prototype.toBaseString = function toBase36String(value){
  var self = this;
  var padding = self.options.length;
  var chars = self.options.chars, baseLength = chars.length;
  var ret = '';
  if (isNaN(value)) {
    throw new Error('error in toBase36String: value is NaN: \"' + value + '\"');
  }
  padding = padding && !isNaN(padding) ? padding : 2;
  
  var hex = Number(Math.abs(value))
    .toString(baseLength).replace('.', '');
  hex = (new Array(Math.max(0, (padding+1)-hex.length))).join('0') + hex;
  
  var i, l=Math.min(hex.length, padding);
  for(i=0; i<l; i++){
    ret += chars.charAt(parseInt(hex.charAt(i), baseLength));
  }
  return ret;
};
