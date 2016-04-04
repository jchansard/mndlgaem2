Temere
=====

Temere means random in Latin.  It is basically a fully tested simple library for generating predictable random strings from a provided or time initialized seed.

Why?
-----

Yep, there are other libraries out there that do something similar, generate random numbers or generate a UUID, PIN, etc...  There are even libraries like Temere, but nothing quite as simple to use or as predictable.  Not to mention I use this in several projects, and rather than copy/paste it to and fro it seemed easier to just publish it for use.

Installation
----------

```
npm install temere
```

Usage
=====

```
// Include the library
var T = require('temere');
// Create an instance
var t = new T();

// Start getting random numbers from it
console.log(t.next());
console.log(t.next());

// You can also set some options
t = new T({seed: 'foobar', length: 10, chars: 'aAbCdE356'});
```

Testing
======

Test with Mocha

```
mocha -R spec
```

Other
=====

Really everything you need to know is above.  If your curious this is an implementation as pointed out in the included PDF as discussed on page 4.  Why that version, I liked it :)

In short:

```
function Random : real; 
(* Integer Version 2 *) 
const 
  a = 16807; 
  m = 2147483647; 
  q = 127773; (* m div a *) 
  r = 2836; (* m mod a *) 
var 
  lo, hi, test : integer; 
begin 
  hi := seed div q; 
  lo := seed mod q; 
  test := a * lo - r * hi; 
  if test > 0 then 
    seed := test 
  else 
    seed := test + m; 
  Random := seed / m;
end;
```
