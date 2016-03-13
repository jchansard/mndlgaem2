$(document).ready(function() {
	if (this.mndltest === 'undefined') { return; }
	mndltest.runTests(tests);
})

tests = {
	"Game.js tests": {
		setup: function() { 
			this.f = new Game.GameShell(); 
		},

		"GameShell constructor should return GameShell object": function() {
			var actual,

			actual = this.f instanceof Game.GameShell;

			assert.isTrue(actual);
		},

		"init should initialize ui objects, load starting screens, and start game tick": function() {
			var actual, expected;
			var tickStub = sinon.stub(this.f, "tick");
			var mocks = [];

			for (var gui in this.f.guis)
			{	
				var scratchStub = sinon.stub(this.f.guis[gui], "changeScreen")
				var mock = sinon.mock(this.f.guis[gui]);
				mock.expects("init").once();
				mocks.push(mock);
			}

			this.f.init();

			actual = tickStub.calledOnce;
			assert.isTrue(actual);

			mocks.forEach(function(m)
			{
				m.verify();
			});
		},

		teardown: function() {
			delete this.f;
		}
	},

	"InputManager.js tests": {
		setup: function() {
			this.f1 = $(document.createElement('div')).attr('id','inputmanager-test');
			$('body').append(this.f1);
			this.f2 = new Game.InputManager(this.f1);
		},

		"InputManager constructor should return InputManager object": function() {
			var actual;

			actual = this.f2 instanceof Game.InputManager;

			assert.isTrue(actual);
		},

		"before init(), events should not be relayed through handleInput": function() {
			var actual, expected;
			var handleInputSpy = sinon.spy(this.f2, "handleInput");

			mndltest.dispatchEvent("keydown", {	which: 40 }, this.f1); 
			mndltest.dispatchEvent("keypress", { which: 40 }, this.f1);
			mndltest.dispatchEvent("click", {
				which: 1,
				pageX: 0,
				pageY: 0
			}, this.f1);

			actual   = handleInputSpy.callCount;
			expected = 0;
			
			handleInputSpy.restore();
			
			assert.equals(actual, expected);
		},

		"after init(), events should be relayed through handleInput": function() {
			var actual, expected;
			var handleInputSpy = sinon.spy(this.f2, "handleInput");
			var handleClickSpy = sinon.stub(this.f2, "handleClick");

			this.f2.init();
			mndltest.dispatchEvent("keydown", {	which: 40 }, this.f1); 
			mndltest.dispatchEvent("keypress", { which: 40 }, this.f1);
			mndltest.dispatchEvent("click", {
				which: 1,
				pageX: 0,
				pageY: 0
			}, this.f1);

			actual   = handleInputSpy.callCount;
			expected = 3;

			assert.equals(actual, expected);

			actual	 = handleClickSpy.callCount;
			expected = 1;

			assert.equals(actual, expected);

			this.f2.handleInput.restore();
			this.f2.handleClick.restore();
		},

		"bindEvents should add events to inputActions and bind context correctly": function() {
			var actual, expected;
			var fnSpy = sinon.spy();
			var context = { id: 'context' }
			context.activeDialog = sinon.stub().returns(undefined);
			var eventType = 'test';
			this.f2._inputActions = {};

			var input = {
				test: {
					context: context,
					eventType: eventType,
					fn: fnSpy
				}
			}
			
			this.f2.bindEvents(input);

			actual = this.f2._inputActions[eventType]['test'] === undefined;
			expected = false;
			assert.equals(expected, actual);
			
			actual = this.f2._inputActions[eventType]['test'] instanceof Array;
			assert.isTrue(actual);
			
			this.f2._inputActions[eventType]['test'][0]();
			actual = fnSpy.calledOnce;
			assert.isTrue(actual);
			
			actual = fnSpy.alwaysCalledOn(context);
			assert.isTrue(actual);
		},
		
		"handleInput finds and calls the appropriate bound function for keyboard events, preventing the default action": function() {
			var actual;
			var keyCodeStub = sinon.stub(Game.Keymap, "keyCodeToAction").returns('test');
			var inputActionStub = sinon.stub();
			var preventDefaultSpy = sinon.spy();
			var e = { type: 'keydown', which: 1, preventDefault: preventDefaultSpy };
			
			this.f2._inputActions = { keydown: { test: [inputActionStub] } };
			this.f2.handleInput(e);
			
			actual = keyCodeStub.calledOnce;
			assert.isTrue(actual);
			
			actual = preventDefaultSpy.called;
			assert.isTrue(actual);
			
			actual = inputActionStub.calledOnce;
			assert.isTrue(actual);

			Game.Keymap.keyCodeToAction.restore();
		},

		"handleClick correctly routes a click action to all valid elements": function() {
			var actual, expected;
			var e = {
				which: 1,
				clientX: 0,
				clientY: 0
			}
			var clickFunctionStub = sinon.stub(this.f2, "_getClickFunction");
			clickFunctionStub.withArgs(1).returns('lclick');
			clickFunctionStub.withArgs(2).returns('mclick');
			clickFunctionStub.withArgs(3).returns('rclick');
			var lSpy = sinon.spy();
			var mSpy = sinon.spy();
			var rSpy = sinon.spy();
			var el1 = {}, el2 = {}, el3 = {};
			el1 = {
				lclick: lSpy,
				mclick: mSpy,
				rclick: rSpy
			};
			$.extend(el2, el1);
			$.extend(el3, el1);
			el3.dummy = 'test'; // make it different from el1 and el2
			var getElementsClickedStub = sinon.stub().returns([el1, el2]);
			var guis = {
				test: {
					getClickedElements: getElementsClickedStub
				}
			}

			this.f2.handleClick(e, guis);

			actual = lSpy.callCount;
			expected = 2;
			assert.equals(actual, expected);

			actual = lSpy.neverCalledWith(el3);
			assert.isTrue(actual);

			var beforeCount = lSpy.callCount;
			e.which = 3;
			this.f2.handleClick(e, guis);
			this.f2._getClickFunction.restore();

			actual = lSpy.callCount;
			expected = beforeCount;
			assert.equals(actual, expected);

			actual = rSpy.callCount;
			expected = 2;
			assert.equals(actual, expected);

		},

		"_getClickFunction returns the correct click function": function() {
			var actual, expected;
			var left = 1;
			var middle = 2;
			var right = 3;

			actual = this.f2._getClickFunction(1);
			expected = 'lclick';
			assert.equals(actual, expected);

			actual = this.f2._getClickFunction(2);
			expected = 'mclick';
			assert.equals(actual, expected);

			actual = this.f2._getClickFunction(3);
			expected = 'rclick';
			assert.equals(actual, expected);
		},
		
		"_isActionBound returns true if action bound in inputactions, else false": function() {
			var actual, expected;
			var passType = 'testtype';		// bound
			var passAction = 'testaction';
			var failType = 'failtype';		// unbound
			var failAction = 'failaction';
			this.f2._inputActions = { testtype: { testaction: sinon.stub() } };
			
			actual   = this.f2._isActionBound(passType, passAction);
			expected = true;
			assert.equals(actual, expected);
			
			actual   = this.f2._isActionBound(failType, failAction);
			expected = false;
			assert.equals(actual, expected)			
		},

		teardown: function() {
			$(this.f1).remove();
			delete this.f1;
		 	delete this.f2;
		}
	},

	"UserInterface.js tests": {
		setup: function() {
			this.f = new Game.UserInterface();
		},

		"render clears the screen and calls render on this and each of this's elements using the element layer index": function() {
			var actual, expected;
			var renderStub  = sinon.stub();
			var renderStub1 = sinon.stub();
			var renderStub2 = sinon.stub();
			var renderStub3 = sinon.stub();
			var clearDisplayStub = sinon.stub(this.f, "clearDisplay");
			var el1 = { render: renderStub1 };
			var el2 = { render: renderStub2 };
			var el3 = { render: renderStub3 };

			this.f.renderCurrentScreen = renderStub;
			this.f._elements = [el1, el2, el3];
			this.f._elementsLayerIndex = [[2, 1], [0]];

			this.f.render();
			this.f.clearDisplay.restore();

			actual = clearDisplayStub.callCount;
			expected = 1;
			assert.equals(actual, expected);

			actual = renderStub.calledOn(this.f);
			assert.isTrue(actual);

			actual = renderStub.callCount;
			expected = 1;
			assert.equals(actual, expected);

			actual = renderStub1.calledOn(el1);
			assert.isTrue(actual);

			actual = renderStub2.calledOn(el2);
			assert.isTrue(actual);

			actual = renderStub3.calledOn(el3);
			assert.isTrue(actual);

			sinon.assert.callOrder(renderStub3, renderStub2, renderStub1);

		},

		"getClickedElements should use areCoordsInBounds to return a list of elements within passed coordinates": function() {
			var actual, expected;
			var el1 = { size: { height: 1, width: 1 }, position: { x: 0, y: 0 } };
			var el2 = { size: { height: 1, width: 1 }, position: { x: 0, y: 0 } };
			var el3 = { size: { height: 1, width: 1 }, position: { x: 2, y: 2 } };
			this.f._elements = [el1, el2, el3];
			var utilsSpy = sinon.spy(Game.Utils, "coordsAreInBounds");
			var e = { 
				which: 1,
				clientX: 0, 
				clientY: 0 
			};
			
			actual = this.f.getClickedElements(e);
			expected = [el1, el2];
			assert.equals(actual, expected);

			actual = utilsSpy.callCount;
			expected = 3;
			assert.equals(actual, expected);

			e.clientX = 1000; // this test will probably fail on a sufficiently sized monitor, or if sufficiently zoomed in...

			actual = this.f.getClickedElements(e);
			expected = [];
			assert.equals(actual, expected);
		},	

		"addElement should call the passed constructor with the passed options, this gui's emitter, and this gui as parameters": function() {
			var actual, expected;
			var options = { test1: 'test1' };
			var testConstructor = sinon.stub().returns(new Object());
			var testEmitter  = 'testEmitter';
			this.f._emitter  = testEmitter;

			this.f.addElement(testConstructor, options, testEmitter);

			actual   = testConstructor.calledWithExactly(options, this.f, testEmitter);
			assert.isTrue(actual);
		},

		"addElement adds the element's index to the element layer index": function() {
			var actual, expected;
			var testObject1 = { layer: 0, getInputEvents: sinon.stub() };
			var testConstructor1 = sinon.stub().returns(testObject1);
			var testObject2 = { layer: 2 };
			var testConstructor2 = sinon.stub().returns(testObject2);
			this.f._elementsLayerIndex = [];
			this.f._elements = [];

			this.f.addElement(testConstructor1);
			this.f.addElement(testConstructor2);
			actual   = this.f._elementsLayerIndex;
			expected = [[0],undefined,[1]];

			assert.equals(actual, expected);
		},

		"addElement returns the constructed element": function() {
			var actual, expected;
			var testObject = { testProp: 'testProp' };
			var testConstructor = sinon.stub().returns(testObject);

			actual   = this.f.addElement(testConstructor);
			expected = testObject;
			assert.equals(actual, expected);
		},

		"clearAllElements clears all elements and the element layer index": function() {
			var actual, expected;

			this.f.clearAllElements();

			actual   = this.f._elements;
			expected = [];
			assert.equals(actual, expected);

			actual   = this.f._elementsLayerIndex;
			expected = [];
			assert.equals(actual, expected);
		},

		// "addElement should add and bind an element to a gui, its emitter, and set it to be the active element when appropriate": function() {
		// 	var actual, expected;
		// 	var bindStub = sinon.stub();
		// 	var emitterStub = sinon.stub();
		// 	var setActiveStub = sinon.stub(this.f, "setActiveElement");
		// 	var el = { bindToGui: bindStub, bindToEmitter: emitterStub }
		// 	this.f._elements = [];

		// 	this.f.addElement(el);

		// 	// should add el
		// 	actual = this.f._elements;
		// 	expected = [el];
		// 	assert.equals(actual, expected);

		// 	// should have set el to active
		// 	actual = setActiveStub.calledOnce && setActiveStub.calledWithExactly(0);
		// 	assert.isTrue(actual);

		// 	// add another element
		// 	this.f.addElement(el);

		// 	// set active shouldn't have been called, since it wasn't the first element and no override was passed
		// 	actual = setActiveStub.calledOnce;
		// 	assert.isTrue(actual);

		// 	// add a third element, this time with override
		// 	this.f.addElement(el, undefined, true);

		// 	// set active should have been called, since activeByDefault is true
		// 	actual = setActiveStub.calledTwice && setActiveStub.calledWithExactly(2);
		// 	assert.isTrue(actual);

		// 	// validate final state of elements
		// 	actual = this.f._elements;
		// 	expected = [el, el, el];
		// 	assert.equals(actual, expected);

		// 	// bind should have been called three times
		// 	actual = bindStub.callCount;
		// 	expected = 3;
		// 	assert.equals(actual, expected);

		// 	// emitter should have been called three times
		// 	actual = emitterStub.callCount;
		// 	expected = 3;
		// 	assert.equals(actual, expected);

		// 	this.f.setActiveElement.restore();
		// },

		// "addElement should bind the element to a drawArea, if a drawArea name is passed and that drawArea exists": function() {
		// 	var actual, expected;
		// 	var bindStub = sinon.stub();
		// 	var setActiveStub = sinon.stub(this.f, "setActiveElement");
		// 	var el = { bindToScreen: bindStub, bindToGui: sinon.stub(), bindToEmitter: sinon.stub() };
		// 	this.f._elements = [];
		// 	this.f._subscreens = { test: undefined };
		// 	this.f._drawAreas['test'] = {};

		// 	this.f.addElement(el, 'test');
		// 	this.f.addElement(el);
		// 	this.f.addElement(el, 'falafel');

		// 	this.f.setActiveElement.restore();

		// 	// bindStub should only have been called once (for the first call)
		// 	actual = bindStub.calledOnce && bindStub.neverCalledWith(undefined);
		// 	assert.isTrue(actual);
		// },

		// "addElement should call the element's init function, if it exists, and continue if it doesn't": function() {
		// 	var actual, expected;
		// 	var initStub = sinon.stub();
		// 	var testConstructor = sinon.stub().returns(new Object());
		// 	var el1 = { init: initStub };
		// 	var el2 = { };

		// 	this.f.addElement(testConstructor, el1);
		// 	this.f.addElement(testConstructor, el2);

		// 	actual = initStub.calledOnce;
		// 	assert.isTrue(actual);
		// },

		"activeElement should return the active element, unless there are no elements, in which case it returns false": function() {
			var actual, expected;
			var test = {};
			this.f._elements = [null, null, null, null, test, null];
			this.f._activeElement = 4;

			actual = this.f.activeElement();
			expected = test;
			assert.equals(actual, expected);

			this.f._elements = [];

			actual = this.f.activeElement();
			expected = false;
			assert.equals(actual, expected);
		},

		"setActiveElement should call bindInputs on the active element and set the active element appropriately": function() {
			var actual, expected;
			var bindInputsStub = sinon.stub(this.f, "bindInputEvents");
			var testInput = 'test-input';
			var test = { getInputEvents: sinon.stub().returns(testInput) };
			this.f._elements = [test];
			this.f._activeElement = null;

			this.f.setActiveElement(0);
			actual = bindInputsStub.calledOnce && bindInputsStub.calledWith(testInput);
			assert.isTrue(actual);

			actual = this.f._activeElement;
			expected = 0;
			assert.equals(actual, expected);

			this.f.bindInputEvents.restore();
		},

		teardown: function() {								
			delete this.f;
		}
	},

	"UIElement.js tests": {
		setup: function() {
			this.f = new Game.UIElements.UIElement();
		},

		"_initPosition moves the element relative to the drawArea's position without modifying it": function() {
			var expected, actual;
			var drawAreaBefore = { x: 5, y: 6 };
			var drawAreaAfter  = { x: 5, y: 6 };
			this.f.position   = { x: 1, y: 1 };

			this.f._initPosition(drawAreaAfter);

			actual   = drawAreaAfter;
			expected = drawAreaBefore;
			assert.equals(actual, expected);

			actual   = { x: this.f.position.x, y: this.f.position.y };
			expected = { x: 6, y: 7 };
		},

		teardown: function() {
			delete this.f;
		}

	},

	"MenuPrompt.js tests": {
		setup: function() {
			this.f = new Game.UIElements.MenuPrompt();
		},

		"_calculateSize should correctly calculate the appropriate size for the prompt, including padding": function() {
			var expected, actual;
			var height = 10, width = 10;
			var padding = 5;
			this.f._size = { height: height, width: width };
			this.f._style.padding = padding;

			actual = this.f._calculateSize();
			expected = { height: height + (2 * padding), width: width + (2 * padding) };
		},

		"coordsToChoice should return the correct choice, or -1 if no choice was clicked": function() {
			var expected, actual;

			// functional test with no padding: choices should be at y = 0 and y = 1. We don't care about x,
			// since this should assume that the element was clicked (so x is within the element)
			var eventToPosStub = sinon.stub();
			eventToPosStub.onFirstCall().returns([1,0])			
				.onSecondCall().returns([99,1])
				.onThirdCall().returns([undefined,2]);
			this.f._gui = { eventToPosition: eventToPosStub };
			this.f._position = { x: 0, y: 0 };
			var options = ['test','test'];

			this.f._style.padding = 0;
			this.f._options = options;

			// click y = 0
			actual = this.f.coordsToChoice({});
			expected = 0;
			assert.equals(actual, expected);

			// click y = 1;
			actual = this.f.coordsToChoice({});
			expected = 1;
			assert.equals(actual, expected);

			// click y = 2, should return -1, since out of bounds
			actual = this.f.coordsToChoice({});
			expected = -1;
			assert.equals(actual, expected);
		},

		"coordsToChoice should respect padding": function() {
			var expected, actual;

			// choices with padding of 3 should be at y = 3 and y = 4.
			var eventToPosStub = sinon.stub();
			eventToPosStub.onFirstCall().returns([2,0])			
				.onSecondCall().returns([99,3])
				.onThirdCall().returns([undefined, 4])
				.onCall(3).returns(['test', 5]);
			this.f._gui = { eventToPosition: eventToPosStub };
			this.f._position = { x: 0, y: 0 };
			var options = ['test','test'];

			this.f._style.padding = 3;
			this.f._options = options;

			// click y = 2; should return -1, since out of bounds
			actual = this.f.coordsToChoice({});
			expected = -1;
			assert.equals(actual, expected);

			// click y = 3
			actual = this.f.coordsToChoice({});
			expected = 0;
			assert.equals(actual, expected);

			// click y = 4
			actual = this.f.coordsToChoice({});
			expected = 1;
			assert.equals(actual, expected);

			// click y = 5; should return -1, since out of bounds
			actual = this.f.coordsToChoice({});
			expected = -1;
			assert.equals(actual, expected);

		},

		teardown: function() {
			delete this.f;
		}
	},

	"Utils.js tests": {
		setup: undefined,

		"cloneSimpleObject should create a copy of a simple object": function() {
			var actual, expected;
			var e = {
				a: 1,
				b: 'c',
				c: new Array(),
				d: ['a', 1, undefined],
			}
			actual = Game.Utils.cloneSimpleObject(e);
			expected = e;
			assert.equals(actual, expected);
		},

		"extendPrototype should extend the target's prototype with the passed object, but not modify the passed object": function() {
			var actual, expected;
			function TestObject() { }
			var target = new TestObject();
			target.prototype = {
				target1: sinon.stub(),
				target2: sinon.stub()
			};
			var source = {
				source1: sinon.stub(),
				source2: sinon.stub()
			};
			var sourceUnchanged = source;

			Game.Utils.extendPrototype(target, source);

			// target1 and target2 should still exist
			actual = (target.prototype.target1 !== undefined && target.prototype.target2 !== undefined);
			assert.isTrue(actual);

			// target should have source1 and source2
			actual = (target.prototype.source1 !== undefined && target.prototype.source2 !== undefined);
			assert.isTrue(actual);

			// source should be unmodified
			actual = source;
			expected = sourceUnchanged;
			assert.equals(actual, expected);

		},

		teardown: undefined
	},

	"Architect.js tests": {
		setup: function() {
			sinon.stub(Game.Architect.testDungeon, "init");
			this.f = new Game.Architect({},{ actor: 'test'});
		},

		"init should generate a new level and add it and the player to the architect's level map": function() {
			var actual, expected;
			var addEntityStub = sinon.stub()
			var testMap = { addEntity: addEntityStub };
			var generateStub = sinon.stub(this.f, "_generateNewLevel").returns(testMap)

			this.f.init();
			this.f._generateNewLevel.restore();

			actual   = generateStub.callCount;
			expected = 1;
			assert.equals(actual, expected);

			actual   = this.f._levelMap;
			expected = [testMap];
			assert.equals(actual, expected);

			actual   = this.f._currentLevel;
			expected = 0;
			assert.equals(actual, expected);

			actual   = addEntityStub.callCount;
			expected = 1;
			assert.equals(actual, expected);
		},

		"_generateNewLevel should generate and return new Map object": function() {
			var actual, expected;
			var generateLevelSpy = sinon.spy(this.f, "_generateNewLevel");

			var returned = this.f._generateNewLevel();

			actual = returned instanceof Game.Map;
			assert.isTrue(actual); 

			this.f._generateNewLevel.restore();
		},

		"_generateNewLevel should use the passed mapType's create method with the passed callback, unless one isn't passed, and call init": function() {
			var actual;
			var createStub = sinon.stub(); 
			var testPropertyStub = sinon.stub();
			var createCalled = false;
			var callbackCalled = false;
			var levelType = {
				// mapType should have a create method that gets called by generateNewLevel
				mapType: function() { 
					createCalled = true; 
					this.create = function(callback) { callback(); }
				},
				// callback accesses properties of the levelType via "this.properties.propertyname"
				mapTypeCallback: function() { callbackCalled = true; this.properties.testproperty(); },
				// this should get called in the callback
				testproperty: testPropertyStub
			};

			this.f._generateNewLevel(levelType);

			actual = createCalled && callbackCalled && testPropertyStub.calledOnce;
			assert.isTrue(actual);

			// if callback is null, shouldn't error
			levelType.mapTypeCallback = undefined;
			this.f._generateNewLevel(levelType); // shouldn't throw an error


		},

		teardown: function() {
			Game.Architect.testDungeon.init.restore();
			delete this.f;
		}
	},

	"ArchitectUtils.js tests": {
		setup: undefined,

		"create2DArray should create an empty 2d array with specified width and height and initial value": function() {
			var actual, expected;
			var width  = 5;
			var height = 3;
			var arr;

			// test without intitial value
			arr = Game.ArchitectUtils.create2DArray(width, height);

			actual = arr.length;
			expected = width;
			assert.equals(actual, expected);

			for (var x = 0; x < width; x++)
			{
				for (var y = 0; y < height; y++)
				{
					actual = arr[x].length;
					expected = height;
					assert.equals(actual, expected);

					actual = arr[x][y];
					expected = undefined;
					assert.equals(actual, expected);
				}
			}

			// test with initial value
			arr = Game.ArchitectUtils.create2DArray(width, height, "major tom");
			actual = arr.length;
			expected = width;
			assert.equals(actual, expected);

			for (var x = 0; x < width; x++)
			{
				for (var y = 0; y < height; y++)
				{
					actual = arr[x].length;
					expected = height;
					assert.equals(actual, expected);

					actual = arr[x][y];
					expected = "major tom";
					assert.equals(actual, expected);
				}
			}			
		},

		teardown: undefined,
	},

	"Map.js tests (depends on create2DArray)": {
		setup: function() {
			var initialValue = { glyph: { ch: 0, fg: 0, bg: 0 } };
			this.f = new Game.Map(Game.ArchitectUtils.create2DArray(3, 2, initialValue));
		},

		"addEntity should call the entity's setMap function": function() {
			var actual;
			var setMapStub = sinon.stub();
			var entity = { setMap: setMapStub };

			this.f.addEntity(entity);

			actual = setMapStub.calledOnce && setMapStub.alwaysCalledWith(this.f);
			assert.isTrue(actual);
		},

		"draw should call the passed callback once for each tile in the map, using the passed thisArg": function() {
			var actual, expected;
			var callback = sinon.stub();
			var thisArg = { test: 'test' };
			this.f._entities = [];

			this.f.draw(callback, thisArg);

			actual   = callback.callCount;
			expected = 3 * 2;
			assert.equals(actual, expected);

			actual = callback.alwaysCalledOn(thisArg);
			assert.isTrue(actual);

			// should have been called on every tile: might need to unrewrite draw to do this
			// for (var x = 0; x < 3; x++)
			// {
			// 	for (var y = 0; y < 2; y++)
			// 	{
			// 		actual = callback.calledWith(x, y);
			// 		// assert.isTrue(actual);					
			// 	}
			// }
		},

		"draw should call each entity's draw function in _entities": function() {
			var actual, expected;
			var tilesBackup = this.f._tiles;
			this.f._tiles = [];
			var drawStub = sinon.stub();
			var thisArg = { test: 'ashes to ashes' };
			var entity1 = { glyph: { ch: '1', fg: '9', bg: '84'}, draw: drawStub  }
			var entity2 = { glyph: { ch: 'sav', fg: 'age', bg: 'jaw'}, draw: drawStub }
			this.f._entities = [entity1, entity2];
			
			this.f.draw(sinon.stub(), thisArg);
			this.f._tiles = tilesBackup;

			actual   = drawStub.callCount;
			expected = this.f._entities.length;
			assert.equals(actual, expected);
		},

		// "addEntity should only add an entity's glyph and position to _entities": function() {
		// 	var actual, expected;
		// 	var entity = { glyph: 0, position: { x: 1, y: 2}, testprop: 3 };
		// 	this.f._entities = [];

		// 	this.f.addEntity(entity);

		// 	actual   = this.f._entities[0];
		// 	expected = { glyph: 0,  x: 1, y: 2 }
		// 	assert.equals(actual, expected);
		// },

		teardown: function() {
			delete this.f;
		}
	},

	"Entity.js tests (depends on EventEmitter)": {
		setup: function() {
			this.f = new Game.Entity({}, new Game.EventEmitter());
		},

		"canMoveTo should return false if the tile at x,y is not traversable and true otherwise": function() {
			var actual, expected;
			var isTraversableStub = sinon.stub();
			isTraversableStub.onFirstCall().returns(true).onSecondCall().returns(false);
			this.f._map = { isTraversable: isTraversableStub };

			actual   = this.f.canMoveTo(0, 0);
			expected = true;
			assert.equals(actual, expected);

			actual   = this.f.canMoveTo(0, 0);
			expected = false;
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete this.f;
		}
	},

	"Deck.js tests": {
		setup: function() {
			this.f = new Game.Deck();
		},

		"draw should draw the 0th card if no index is passed; else, remove passed index": function() {
			var actual, expected;
			var card1 = 'test1'
			var card2 = 'test2'
			var card3 = 'test3'
			this.f._cardList = [card1, card2, card3];

			this.f.draw();
			expected = [card2, card3];
			actual   = this.f._cardList;

			assert.equals(actual, expected);

			this.f.draw(1);
			expected = [card2];
			actual   = this.f._cardList;
			assert.equals(actual, expected);
		},

		"get should return the card at the specified index, or -1 if out of bounds": function() {
			var actual, expected;
			this.f._cardList = ['test'];

			// in bounds
			actual   = this.f.get(0);
			expected = 'test';
			assert.equals(actual, expected);

			// out of bounds: too low
			actual   = this.f.get(-50);
			expected = undefined;
			assert.equals(actual, expected);

			// out of bounds: too high
			actual   = this.f.get(1);
			expected = undefined;
			assert.equals(actual, expected);

		},

		"select should adds the passed index in _cardList to _selected, unless it's already selected, in which case it removes it": function() {
			var actual, expected;
			this.f._cardList = 'test'
			
			this.f.select(0);

			// add selected
			actual   = this.f._selected;
			expected = [0];
			assert.equals(actual, expected);

			// don't modify cardlist
			actual   = this.f._cardList;
			expected = 'test'
			assert.equals(actual, expected);

			// remove selected
			this.f.select(0);

			actual   = this.f._selected;
			expected = [];
			assert.equals(actual, expected);
		},

		"confirmSelection should return and empty _selected": function() {
			var actual, expected;
			this.f._selected = ['test1', 'test2'];

			actual = this.f.confirmSelection();
			expected = ['test1', 'test2'];
			assert.equals(actual, expected);

			actual = this.f._selected;
			expected = [];
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete this.f;
		}
	},

	"PlayerCards.js tests": {
		setup: function() {
			this.f = new Game.PlayerCards();
		},

		"_drawCard with no specified deck should draw cards from the draw deck and add them to the hand": function() {
			var actual, expected;
			var drawStub = sinon.stub();
			var addStub  = sinon.stub();
			var lengthStub = sinon.stub();
			lengthStub.onFirstCall().returns(2).onSecondCall().returns(1);
			this.f._draw = { draw: drawStub, length: lengthStub }
			this.f._hand = { add: addStub, length: lengthStub }

			// this.f._draw._cardList = ['test1', 'test2'];

			this.f._drawCard();
			this.f._drawCard(2);

			actual = drawStub.calledTwice && addStub.calledTwice;
			assert.isTrue(actual);

			actual = drawStub.calledWithExactly(2);
			assert.isTrue(actual);
		},

		"_drawCard should call shuffleDiscardIntoDraw if there are no cards to draw": function() {
			var actual, expected;
			var drawLengthStub = sinon.stub();
			drawLengthStub.returns(0);
			var shuffleDiscardStub = sinon.stub(this.f, "_shuffleDiscardIntoDraw");

			this.f._draw = { draw: sinon.stub(), length: drawLengthStub };
			this.f._discard ={ shuffle: sinon.stub(), addTo: sinon.stub() }

			// draw a card
			this.f._drawCard();
			this.f._shuffleDiscardIntoDraw.restore();

			actual = shuffleDiscardStub.calledOnce;
			assert.isTrue(actual);
		},

		"drawCards should draw the specified number of cards and publishes a deck change event": function() {
			var actual, expected;
			var drawStub = sinon.stub(this.f, "_drawCard");
			var publishStub = sinon.stub(this.f, "_publishDeckChange");

			this.f.drawCards(3);

			this.f._drawCard.restore();
			this.f._publishDeckChange.restore();

			actual   = drawStub.callCount;
			expected = 3;
			assert.equals(actual, expected);

			actual   = publishStub.callCount;
			expected = 1;
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete this.f;
		}
	},

	"Calc.js tests": {
		setup: function() {
			this.f = new Game.Calc();
		},

		"distanceBetweenPoints should return the distance between two points using the distance formula, and handle boundary cases": function() {
			var actual, expected;
			// return 4
			var p1 = [0,0]
			var p2 = [4,0]
			// return 0
			var p3 = [0,0]
			var p4 = [0,0]
			//return 24
			var p5 = [0, -12]
			var p6 = [0, 12]


			actual   = this.f.distanceBetweenPoints(p1, p2)
			expected = 4;
			assert.equals(actual, expected);

			actual   = this.f.distanceBetweenPoints(p3, p4)
			expected = 0;
			assert.equals(actual, expected);

			actual   = this.f.distanceBetweenPoints(p5, p6);
			expected = 24;
			assert.equals(actual, expected);

		},

		teardown: function() {
			delete this.f;
		}
	}
};