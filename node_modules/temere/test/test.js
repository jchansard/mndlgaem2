var assert = require('assert');
var T = require('../');

describe('Temere test cases', function(){
  var isValid = function(t, answer){
    var numChars = t.options.length;
    var reChars = new RegExp('['+t.options.chars + ']{'+numChars+'}');
    assert(answer, 'The answer should exist.');
    assert(answer.length === numChars, 'The should be default length');
    assert(reChars.exec(answer), 'Should only contain valid characters');
  };
  describe('With defaults', function(){
    var t;
    it('Can create without options', function(){
      t = new T();
      assert(t, 'Instance was returned properly');
    });
    it('Should generate a sequence', function(){
      var answer = t.next();
      isValid(t, answer);
    });
    it('Should allow the seed to be set to a different value', function(){
      t.seed(5);
    });
    it('Should generate the same value for the same seed', function(){
      var answer1, answer2, t2 = new T({seed: 5});
      t.seed(5);
      answer1 = t.next();
      answer2 = t2.next();
      assert(answer1===answer2, 'For the same seed the same value should come out next');
      t2.reset();
      answer2 = t2.next();
      assert(answer1===answer2, 'Reset should return to the initial state');
    });
    it('Reset should return to the initial state', function(){
      var answer1, answer2;
      t.seed(5);
      answer1 = t.next();
      t.reset();
      answer2 = t.next();
      assert(answer1===answer2, 'Didn\'t reset to the proper seed value');
    });
  });
  describe('Options', function(){
    var t;
    it('Should take options and adjust', function(){
      var val;
      t = new T({seed: 5, length: 6});
      assert(t.options.length === 6, 'Options length is not 6');
      assert(t.options.seed === 5, 'Options seed is not 5');
      val = t.next();
      assert(val.length === t.options.length, 'Generated value is not proper length'+t.options.length);
    });
    it('Should take a string as the seed', function(){
      t = new T({seed: 'toaster'});
      t.next();
    });
    it('Should generate different values for different string seeds', function(){
      var t2 = new T({seed: 'baadf00d'});
      t.seed('toaster');
      assert(t.next() !== t2.next(), 'Different seeds created the same value');
    });
  });
  describe('Entropy', function(){
    var t = new T({seed: 5, length: 6, chars: 'abc'}), idx, v;
    it('Should have a decently high entropy (9,323 tries on 9,324 it should duplicate)', function(){
      var i=0, numTries = 9324;
      var store = new Array(numTries);
      t.options.length=6;
      while(i<numTries){
        v = t.next();
        store[i] = v;
        i++;
      }
      idx = store.indexOf(v[0]);
      assert(idx===-1, 'Duplicate not found in 10,000 tries');
      assert(idx!==9323, 'Duplicate found at wrong position itteration '+idx+' for seed '+t.options.seed);
    });
    it('Should use all characters', function(){
      assert(v.indexOf('a')!==-1, 'a not found');
      assert(v.indexOf('b')!==-1, 'b not found');
      assert(v.indexOf('c')!==-1, 'c not found');
    });
  });
});