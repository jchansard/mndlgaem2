const sinon  = require('sinon');
const assert = require('./mndltest').assert;
const $      = require('jquery');
var dir = '../js/'; // directory to scripts being tested
var t   = {}; 		// test object

const aat = require(dir + 'display/ui');

module.exports = {
	"Game.js tests": {
		setup: function() { 
			var GameShell = require(dir + 'game');
			t.f = new GameShell();
		},

		"init should initialize ui objects, load starting screens, and start game tick": function() {
			var actual, expected;
			var tickStub = sinon.stub(t.f, "tick");
			var mocks = [];

			for (var gui in t.f.guis)
			{	
				var scratchStub = sinon.stub(t.f.guis[gui], "changeScreen")
				var mock = sinon.mock(t.f.guis[gui]);
				mock.expects("init").once();
				mocks.push(mock);
			}

			t.f.init();

			actual = tickStub.calledOnce;
			assert.isTrue(actual);

			mocks.forEach(function(m)
			{
				m.verify();
			});
		},

		teardown: function() {
			delete t.f;
		}
	},

	"InputManager.js tests": {
		setup: function() {
			t.f1 = $(document.createElement('div')).attr('id','inputmanager-test');
			$('body').append(t.f1);
			var InputManager = require(dir + 'input/inputmanager')
			t.f2 = new InputManager(t.f1);
		},

		"before init(), events should not be relayed through handleInput": function() {
			var actual, expected;
			var handleInputSpy = sinon.spy(t.f2, "handleInput");

			assert.dispatchEvent("keydown", {	which: 40 }, t.f1); 
			assert.dispatchEvent("keypress", { which: 40 }, t.f1);
			assert.dispatchEvent("click", {
				which: 1,
				pageX: 0,
				pageY: 0
			}, t.f1);

			actual   = handleInputSpy.callCount;
			expected = 0;
			
			handleInputSpy.restore();
			
			assert.equals(actual, expected);
		},

		"after init(), events should be relayed through handleInput": function() {
			var actual, expected;
			var handleInputStub = sinon.stub(t.f2, "handleInput");
			var handleClickStub = sinon.stub(t.f2, "handleClick");
			sinon.stub(t.f2, "_initListeners");

			t.f2.init();
			assert.dispatchEvent("keydown", { which: 40 }, t.f1); 
			assert.dispatchEvent("keypress", { which: 40 }, t.f1);
			assert.dispatchEvent("click", {
				which: 1,
				pageX: 0,
				pageY: 0
			}, t.f1);

			actual   = handleInputStub.callCount;
			expected = 3;

			assert.equals(actual, expected);

			t.f2.handleInput.restore();
			t.f2.handleClick.restore();
		},

		"after init(), clicks should be relayed through handleClick": function() {
			var actual, expected;
			var InputManager = require(dir + 'input/inputmanager')
			t.f2 = new InputManager(t.f1);
			var handleInputSpy = sinon.spy(t.f2, "handleInput");
			var handleClickSpy = sinon.stub(t.f2, "handleClick");
			sinon.stub(t.f2, "_initListeners");

			t.f2.init();
			assert.dispatchEvent("click", {
				which: 1,
				pageX: 0,
				pageY: 0
			}, t.f1);

			actual   = handleClickSpy.callCount;
			expected = 1;

			assert.equals(actual, expected);

			t.f2.handleInput.restore();
			t.f2.handleClick.restore();

		},

		"bindEvents should add events to inputActions and bind context correctly": function() {
			var actual, expected;
			var fnSpy = sinon.spy();
			var context = { id: 'context' }
			context.activeDialog = sinon.stub().returns(undefined);
			var eventType = 'test';
			t.f2._inputActions = {};

			var input = {
				test: {
					context: context,
					eventType: eventType,
					fn: fnSpy
				}
			}
			
			t.f2.bindEvents(input);

			actual = t.f2._inputActions[eventType]['test'] === undefined;
			expected = false;
			assert.equals(expected, actual);
			
			actual = t.f2._inputActions[eventType]['test'] instanceof Array;
			assert.isTrue(actual);
			
			t.f2._inputActions[eventType]['test'][0]();
			actual = fnSpy.calledOnce;
			assert.isTrue(actual);
			
			actual = fnSpy.alwaysCalledOn(context);
			assert.isTrue(actual);
		},
		
		"handleInput finds and calls the appropriate bound function for keyboard events, preventing the default action": function() {
			var actual;
			var keyCodeStub = sinon.stub().returns('test');
			t.f2._keymap = {};
			t.f2._keymap.keyCodeToAction = keyCodeStub;
			var inputActionStub = sinon.stub();
			var preventDefaultSpy = sinon.spy();
			var e = { type: 'keydown', which: 1, preventDefault: preventDefaultSpy };
			
			t.f2._inputActions = { keydown: { test: [inputActionStub] } };
			t.f2.handleInput(e);
			
			actual = keyCodeStub.calledOnce;
			assert.isTrue(actual);
			
			actual = preventDefaultSpy.called;
			assert.isTrue(actual);
			
			actual = inputActionStub.calledOnce;
			assert.isTrue(actual);
		},

		"handleClick correctly routes a click action to all valid elements": function() {
			var actual, expected;
			var e = {
				which: 1,
				clientX: 0,
				clientY: 0
			}
			var clickFunctionStub = sinon.stub(t.f2, "_getClickFunction");
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

			t.f2.handleClick(e, guis);

			actual = lSpy.callCount;
			expected = 2;
			assert.equals(actual, expected);

			actual = lSpy.neverCalledWith(el3);
			assert.isTrue(actual);

			var beforeCount = lSpy.callCount;
			e.which = 3;
			t.f2.handleClick(e, guis);
			t.f2._getClickFunction.restore();

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

			actual = t.f2._getClickFunction(1);
			expected = 'lclick';
			assert.equals(actual, expected);

			actual = t.f2._getClickFunction(2);
			expected = 'mclick';
			assert.equals(actual, expected);

			actual = t.f2._getClickFunction(3);
			expected = 'rclick';
			assert.equals(actual, expected);
		},
		
		"_isActionBound returns true if action bound in inputactions, else false": function() {
			var actual, expected;
			var passType = 'testtype';		// bound
			var passAction = 'testaction';
			var failType = 'failtype';		// unbound
			var failAction = 'failaction';
			t.f2._inputActions = { testtype: { testaction: sinon.stub() } };
			
			actual   = t.f2._isActionBound(passType, passAction);
			expected = true;
			assert.equals(actual, expected);
			
			actual   = t.f2._isActionBound(failType, failAction);
			expected = false;
			assert.equals(actual, expected)			
		},

		teardown: function() {
			$(t.f1).remove();
			delete t.f1;
		 	delete t.f2;
		}
	},

	"UserInterface.js tests": {
		setup: function() {
			var UserInterface = require(dir + 'display/ui')
			t.f = new UserInterface();
		},

		"render clears the screen and calls render on this and each of this's elements using the element layer index": function() {
			var actual, expected;
			var renderStub  = sinon.stub();
			var renderStub1 = sinon.stub();
			var renderStub2 = sinon.stub();
			var renderStub3 = sinon.stub();
			var clearDisplayStub = sinon.stub(t.f, "clearDisplay");
			var el1 = { render: renderStub1 };
			var el2 = { render: renderStub2 };
			var el3 = { render: renderStub3 };

			t.f.renderCurrentScreen = renderStub;
			t.f._elements = [el1, el2, el3];
			t.f._elementsLayerIndex = [[2, 1], [0]];

			t.f.render();
			t.f.clearDisplay.restore();

			actual = clearDisplayStub.callCount;
			expected = 1;
			assert.equals(actual, expected);

			actual = renderStub.calledOn(t.f);
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

		"if drawInfo has a text property, draw should call drawText; otherwise, it should call drawGlyph": function() {
			var actual, expected;
			var drawTextStub  = sinon.stub(t.f, "_drawText");
			var drawGlyphStub = sinon.stub(t.f, "_drawGlyph");
			var drawInfo = { text: 'text' };

			t.f.draw(0, 0, drawInfo);
			t.f.draw(1, 1, {});

			t.f._drawText.restore();
			t.f._drawGlyph.restore();

			actual = drawTextStub.calledOnce && drawTextStub.calledWith(0, 0);
			assert.isTrue(actual);

			actual = drawGlyphStub.calledOnce && drawGlyphStub.calledWith(1, 1);
			assert.isTrue(actual);

		},

		"getClickedElements should use areCoordsInBounds to return a list of elements within passed coordinates": function() {
			var actual, expected;
			var el1 = { size: { height: 1, width: 1 }, position: { x: 0, y: 0 } };
			var el2 = { size: { height: 1, width: 1 }, position: { x: 0, y: 0 } };
			var el3 = { size: { height: 1, width: 1 }, position: { x: 2, y: 2 } };
			t.f._elements = [el1, el2, el3];
			var utilsSpy = sinon.spy(t.f, "coordsAreInBounds");
			var e = { 
				which: 1,
				clientX: 0, 
				clientY: 0 
			};
			
			actual = t.f.getClickedElements(e);
			expected = [el1, el2];
			assert.equals(actual, expected);

			actual = utilsSpy.callCount;
			expected = 3;
			assert.equals(actual, expected);

			e.clientX = 1000; // this test will probably fail on a sufficiently sized monitor, or if sufficiently zoomed in...

			actual = t.f.getClickedElements(e);
			expected = [];
			assert.equals(actual, expected);
		},	

		"addElement should call the passed constructor with the passed options, this gui's emitter, and this gui's id as parameters": function() {
			var actual, expected;
			var options = { test1: 'test1' };
			var testConstructor = sinon.stub().returns(new Object());
			var testEmitter  = 'testEmitter';
			sinon.stub(t.f, '_generateElementID');
			t.f._emitter  = testEmitter;
			t.f.id = 'test-id'

			t.f.addElement(testConstructor, options, testEmitter);
			t.f._generateElementID.restore();

			actual = testConstructor.calledWithExactly(options, 'test-id', testEmitter);
			assert.isTrue(actual);
		},

		"addElement adds the element's index to the element layer index and to the element id index": function() {
			var actual, expected;
			var testObject1 = { layer: 0, getInputEvents: sinon.stub() };
			var testConstructor1 = sinon.stub().returns(testObject1);
			var testObject2 = { layer: 2 };
			var testConstructor2 = sinon.stub().returns(testObject2);
			var generateIDStub = sinon.stub(t.f, '_generateElementID');
			generateIDStub.onFirstCall().returns('test').onSecondCall().returns('control');
			sinon.stub(t.f, 'setActiveElement');


			t.f._elementsLayerIndex = [];
			t.f._elementsIDIndex = {};
			t.f._elements = [];

			t.f.addElement(testConstructor1);
			t.f.addElement(testConstructor2);

			t.f.setActiveElement.restore();
			t.f._generateElementID.restore();

			actual   = t.f._elementsLayerIndex;
			expected = [[0],undefined,[1]];
			assert.equals(actual, expected);

			actual   = t.f._elementsIDIndex;
			expected = {'test': 0, 'control': 1}
			assert.equals(actual, expected);
		},

		"addElement returns the constructed element, both via a return and via the returnObject object": function() {
			var actual, expected;
			var testObject = { testProp: 'testProp' };
			var testConstructor = sinon.stub().returns(testObject);
			sinon.stub(t.f, '_generateElementID');
			var testReturn = {};

			actual   = t.f.addElement(testConstructor, null, null, testReturn);
			expected = testObject;
			t.f._generateElementID.restore();
			assert.equals(actual, expected);

			sinon.stub(t.f, '_generateElementID');

			actual   = testReturn.data;
			expected = testObject;
			t.f._generateElementID.restore();
			assert.equals(actual, expected);
		},

		"closeElement removes the specified element from elements and cleans up indices": function() {
			var actual, expected;
			var cleanIndexStub = sinon.stub(t.f, '_cleanUpIndices');
			var a = new Object();
			var id = 'testID'
			t.f._elements = [a, 4, 5, 'test'];
			t.f._elementsIDIndex[id] = 0;

			t.f.closeElement(id);
			t.f._cleanUpIndices.restore();

			actual   = t.f._elements;
			expected = [4, 5, 'test'];
			assert.equals(actual, expected);
		},

		"cleanUpIndices removes references to an element in the elementsLayerIndex and elementsIDIndex indices": function() {
			var actual, expected;
			var index = 3;
			var id = 'testID'
			var layer = 1;
			t.f._elementsIDIndex = {
				'testID': 'test-value',
				'testID2': 'test-value-2',
				'5': 55
			};
			t.f._elementsLayerIndex = [[1],[0,3],[],[2]];

			t.f._cleanUpIndices(index, id, layer);

			actual   = t.f._elementsIDIndex;
			expected = {
				'testID2': 'test-value-2',
				'5': 55
			};
			assert.equals(actual, expected);

			actual   = t.f._elementsLayerIndex;
			expected = [[1],[0],[],[2]];
			assert.equals(actual, expected);
		},

		"clearAllElements clears all elements and indices": function() {
			var actual, expected;
			t.f._elements = [1,23,4,5];
			t.f._elementsLayerIndex = [1,23,4,5];
			t.f._elementsIDIndex = { a: 'b' };

			t.f.clearAllElements();

			actual   = t.f._elements;
			expected = [];
			assert.equals(actual, expected);

			actual   = t.f._elementsLayerIndex;
			expected = [];
			assert.equals(actual, expected);

			actual   = t.f._elementsIDIndex;
			expected = {};
			assert.equals(actual, expected);
		},

		// "addElement should add and bind an element to a gui, its emitter, and set it to be the active element when appropriate": function() {
		// 	var actual, expected;
		// 	var bindStub = sinon.stub();
		// 	var emitterStub = sinon.stub();
		// 	var setActiveStub = sinon.stub(t.f, "setActiveElement");
		// 	var el = { bindToGui: bindStub, bindToEmitter: emitterStub }
		// 	t.f._elements = [];

		// 	t.f.addElement(el);

		// 	// should add el
		// 	actual = t.f._elements;
		// 	expected = [el];
		// 	assert.equals(actual, expected);

		// 	// should have set el to active
		// 	actual = setActiveStub.calledOnce && setActiveStub.calledWithExactly(0);
		// 	assert.isTrue(actual);

		// 	// add another element
		// 	t.f.addElement(el);

		// 	// set active shouldn't have been called, since it wasn't the first element and no override was passed
		// 	actual = setActiveStub.calledOnce;
		// 	assert.isTrue(actual);

		// 	// add a third element, this time with override
		// 	t.f.addElement(el, undefined, true);

		// 	// set active should have been called, since activeByDefault is true
		// 	actual = setActiveStub.calledTwice && setActiveStub.calledWithExactly(2);
		// 	assert.isTrue(actual);

		// 	// validate final state of elements
		// 	actual = t.f._elements;
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

		// 	t.f.setActiveElement.restore();
		// },

		// "addElement should bind the element to a drawArea, if a drawArea name is passed and that drawArea exists": function() {
		// 	var actual, expected;
		// 	var bindStub = sinon.stub();
		// 	var setActiveStub = sinon.stub(t.f, "setActiveElement");
		// 	var el = { bindToScreen: bindStub, bindToGui: sinon.stub(), bindToEmitter: sinon.stub() };
		// 	t.f._elements = [];
		// 	t.f._subscreens = { test: undefined };
		// 	t.f._drawAreas['test'] = {};

		// 	t.f.addElement(el, 'test');
		// 	t.f.addElement(el);
		// 	t.f.addElement(el, 'falafel');

		// 	t.f.setActiveElement.restore();

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

		// 	t.f.addElement(testConstructor, el1);
		// 	t.f.addElement(testConstructor, el2);

		// 	actual = initStub.calledOnce;
		// 	assert.isTrue(actual);
		// },

		"activeElement should return the active element, unless there are no elements, in which case it returns false": function() {
			var actual, expected;
			var test = {};
			t.f._elements = [null, null, null, null, test, null];
			t.f._activeElement = 4;

			actual = t.f.activeElement();
			expected = test;
			assert.equals(actual, expected);

			t.f._elements = [];

			actual = t.f.activeElement();
			expected = false;
			assert.equals(actual, expected);
		},

		"setActiveElement should call bindInputs on the active element and set the active element appropriately": function() {
			var actual, expected;
			var bindInputsStub = sinon.stub(t.f, "bindInputEvents");
			var testInput = 'test-input';
			var test = { getInputEvents: sinon.stub().returns(testInput) };
			t.f._elements = [test];
			t.f._activeElement = null;

			t.f.setActiveElement(0);
			actual = bindInputsStub.calledOnce && bindInputsStub.calledWith(testInput);
			assert.isTrue(actual);

			actual = t.f._activeElement;
			expected = 0;
			assert.equals(actual, expected);

			t.f.bindInputEvents.restore();
		},

		"eventToPosition returns its output via the returnObject object as well as a normal return": function() {
			var actual, expected;
			var eventToPosStub = sinon.stub().returns('test value');
			var eventToPosStub2 = sinon.stub().returns('another test');
			t.f._displays[0] = { eventToPosition: eventToPosStub };
			t.f._displays[15] = { eventToPosition: eventToPosStub2 };

			actual   = t.f.eventToPosition({});
			expected = 'test value';
			assert.equals(actual, expected);

			actual   = t.f.eventToPosition({}, 15);
			expected = 'another test';
			assert.equals(actual, expected);
		},

		"eventToPosition checks the passed layer or 0 by default": function() {
			var actual, expected;
			var eventToPosStub = sinon.stub().returns('test value');
			var returnObject = {};
			t.f._displays[0] = { eventToPosition: eventToPosStub };

			actual   = t.f.eventToPosition({}, null, returnObject);
			expected = 'test value';
			assert.equals(actual, expected);

			actual   = returnObject.data;
			expected = 'test value';
			assert.equals(actual, expected);
		},

		teardown: function() {								
			delete t.f;
		}
	},

	"UIElement.js tests": {
		setup: function() {
			var UIElement = require(dir + 'ui-elements/uielement')
			t.f = new UIElement();
		},

		"_initPosition moves the element relative to the drawArea's position without modifying it": function() {
			var expected, actual;
			var drawAreaBefore = { x: 5, y: 6 };
			var drawAreaAfter  = { x: 5, y: 6 };
			t.f.position   = { x: 1, y: 1 };

			t.f._initPosition(drawAreaAfter);

			actual   = drawAreaAfter;
			expected = drawAreaBefore;
			assert.equals(actual, expected);

			actual   = { x: t.f.position.x, y: t.f.position.y };
			expected = { x: 6, y: 7 };
		},

		teardown: function() {
			delete t.f;
		}

	},

	"MenuPrompt.js tests": {
		setup: function() {
			var MenuPrompt = require(dir + 'ui-elements/index').MenuPrompt;
			t.f = new MenuPrompt();
		},

		"_calculateSize should correctly calculate the appropriate size for the prompt, including padding": function() {
			var expected, actual;
			var height = 10, width = 10;
			var padding = 5;
			t.f._size = { height: height, width: width };
			t.f._style.padding = padding;

			actual = t.f._calculateSize();
			expected = { height: height + (2 * padding), width: width + (2 * padding) };
		},

		"coordsToChoice should return the correct choice, or -1 if no choice was clicked": function() {
			var expected, actual;

			// functional test with no padding: choices should be at y = 0 and y = 1. We don't care about x,
			// since this should assume that the element was clicked (so x is within the element)
			var coords1 = [1,0];
			var coords2 = [99,1];
			var coords3 = [undefined,2]
			t.f._position = { x: 0, y: 0 };
			var options = ['test','test'];

			t.f._style.padding = 0;
			t.f._options = options;

			// click y = 0
			actual = t.f.coordsToChoice({}, coords1);
			expected = 0;
			assert.equals(actual, expected);

			// click y = 1;
			actual = t.f.coordsToChoice({}, coords2);
			expected = 1;
			assert.equals(actual, expected);

			// click y = 2, should return -1, since out of bounds
			actual = t.f.coordsToChoice({}, coords3);
			expected = -1;
			assert.equals(actual, expected);
		},

		"coordsToChoice should respect padding": function() {
			var expected, actual;

			// choices with padding of 3 should be at y = 3 and y = 4.
			t.f._position = { x: 0, y: 0 };
			var coords1 = [2,0];
			var coords2 = [99,3];
			var coords3 = [undefined,4];
			var coords4 = ['test',5];
			var options = ['test','test'];

			t.f._style.padding = 3;
			t.f._options = options;

			// click y = 2; should return -1, since out of bounds
			actual = t.f.coordsToChoice({}, coords1);
			expected = -1;
			assert.equals(actual, expected);

			// click y = 3
			actual = t.f.coordsToChoice({}, coords2);
			expected = 0;
			assert.equals(actual, expected);

			// click y = 4
			actual = t.f.coordsToChoice({}, coords3);
			expected = 1;
			assert.equals(actual, expected);

			// click y = 5; should return -1, since out of bounds
			actual = t.f.coordsToChoice({}, coords4);
			expected = -1;
			assert.equals(actual, expected);

		},

		teardown: function() {
			delete t.f;
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
			actual = require(dir + 'util/cloneobject')(e);
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

			require(dir + 'util/extend')(target, source);

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

		"create2DArray should create an empty 2d array with specified width and height and initial value": function() {
			var actual, expected;
			var create2DArray = require(dir + 'util/create2darray')
			var width  = 5;
			var height = 3;
			var arr;

			// test without intitial value
			arr = create2DArray(width, height);

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
			arr = create2DArray(width, height, "major tom");
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

		teardown: undefined
	},

	"Player.js test": {
		setup: function() {
			var Player = require(dir + 'player/player')
			t.f = new Player();
		},

		"calculateCardEffects should populate an effects simple object with their total power values": function() {
			var actual, expected;
			var cards = [ { power: 3 }, { power: 5 }, { power: -2 } ];
			var effects;

			effects = t.f.calculateCardEffects(cards);

			actual   = effects.power;
			expected = 6;
			assert.equals(actual, expected);
		},

		teardown: function()
		{
			delete t.f;
		}
	},

	"Architect.js tests": {
		setup: function() {
			var Architect = require(dir + 'architect/architect');
			t.f = new Architect({},{ actor: 'test'});
		},

		"init should generate a new level and add it and the player to the architect's level map": function() {
			var actual, expected;
			var addEntityStub = sinon.stub()
			var testMap = { addEntity: addEntityStub };
			var generateStub = sinon.stub(t.f, "_generateNewLevel").returns(testMap)

			t.f.init();
			t.f._generateNewLevel.restore();

			actual   = generateStub.callCount;
			expected = 1;
			assert.equals(actual, expected);

			actual   = t.f._levelMap;
			expected = [testMap];
			assert.equals(actual, expected);

			actual   = t.f._currentLevel;
			expected = 0;
			assert.equals(actual, expected);

			actual   = addEntityStub.callCount;
			expected = 1;
			assert.equals(actual, expected);
		},

		"_generateNewLevel should generate and return new Map object": function() {
			var actual, expected;
			var generateLevelSpy = sinon.spy(t.f, "_generateNewLevel");
			var GameMap = require(dir + '/architect/map')

			var returned = t.f._generateNewLevel();

			actual = returned instanceof GameMap;
			assert.isTrue(actual); 

			t.f._generateNewLevel.restore();
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
				// callback accesses properties of the levelType via "t.properties.propertyname"
				mapTypeCallback: function() { callbackCalled = true; this.properties.testproperty(); },
				// this should get called in the callback
				testproperty: testPropertyStub
			};

			t.f._generateNewLevel(levelType);

			actual = createCalled && callbackCalled && testPropertyStub.calledOnce;
			assert.isTrue(actual);

			// if callback is null, shouldn't error
			levelType.mapTypeCallback = undefined;
			t.f._generateNewLevel(levelType); // shouldn't throw an error


		},

		teardown: function() {
			delete t.f;
		}
	},

	"Map.js tests (depends on create2DArray)": {
		setup: function() {
			var GameMap = require(dir + 'architect/map');
			var initialValue = { glyph: { ch: 0, fg: 0, bg: 0 } };
			t.f = new GameMap(require(dir + 'util/create2darray')(3, 2, initialValue));
		},

		"addEntity should call the entity's setMap function": function() {
			var actual;
			var setMapStub = sinon.stub();
			var entity = { setMap: setMapStub };

			t.f.addEntity(entity);

			actual = setMapStub.calledOnce && setMapStub.alwaysCalledWith(t.f);
			assert.isTrue(actual);
		},

		"draw should call the passed callback once for each tile in the map": function() {
			var actual, expected;
			var callback = sinon.stub();
			t.f._entities = [];

			t.f.draw(callback);

			actual   = callback.callCount;
			expected = 3 * 2;
			assert.equals(actual, expected);

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
			var tilesBackup = t.f._tiles;
			t.f._tiles = [];
			var drawStub = sinon.stub();
			var thisArg = { test: 'ashes to ashes' };
			var entity1 = { glyph: { ch: '1', fg: '9', bg: '84'}, draw: drawStub  }
			var entity2 = { glyph: { ch: 'sav', fg: 'age', bg: 'jaw'}, draw: drawStub }
			t.f._entities = [entity1, entity2];
			
			t.f.draw(sinon.stub(), thisArg);
			t.f._tiles = tilesBackup;

			actual   = drawStub.callCount;
			expected = t.f._entities.length;
			assert.equals(actual, expected);
		},

		// "addEntity should only add an entity's glyph and position to _entities": function() {
		// 	var actual, expected;
		// 	var entity = { glyph: 0, position: { x: 1, y: 2}, testprop: 3 };
		// 	t.f._entities = [];

		// 	t.f.addEntity(entity);

		// 	actual   = t.f._entities[0];
		// 	expected = { glyph: 0,  x: 1, y: 2 }
		// 	assert.equals(actual, expected);
		// },

		teardown: function() {
			delete t.f;
		}
	},

	"Entity.js tests": {
		setup: function() {
			var Entity = require(dir + 'entities/entity');
			t.f = new Entity();
		},

		"canMoveTo should return false if the tile at x,y is not traversable and true otherwise": function() {
			var actual, expected;
			var isTraversableStub = sinon.stub();
			isTraversableStub.onFirstCall().returns(true).onSecondCall().returns(false);
			t.f._map = { isTraversable: isTraversableStub };

			actual   = t.f.canMoveTo(0, 0);
			expected = true;
			assert.equals(actual, expected);

			actual   = t.f.canMoveTo(0, 0);
			expected = false;
			assert.equals(actual, expected);
		},

		"position returns position as an array if mode is true, else object with x and y values": function() {
			var actual, expected;
			t.f._x = 4;
			t.f._y = 'test';

			actual   = t.f.position(1);
			expected = [4,'test'];
			assert.equals(actual, expected);

			actual   = t.f.position(0);
			expected = {x: 4, y: 'test'};
			assert.equals(actual, expected);

			actual   = t.f.position();
			expected = {x: 4, y: 'test'};
			assert.equals(actual, expected);			
		},

		teardown: function() {
			delete t.f;
		}
	},

	"Deck.js tests": {
		setup: function() {
			var Deck = require(dir + 'player/deck');
			t.f = new Deck();
		},

		"draw should draw the 0th card if no index is passed; else, remove passed index": function() {
			var actual, expected;
			var card1 = 'test1'
			var card2 = 'test2'
			var card3 = 'test3'
			t.f._cardList = [card1, card2, card3];

			t.f.draw();
			expected = [card2, card3];
			actual   = t.f._cardList;

			assert.equals(actual, expected);

			t.f.draw(1);
			expected = [card2];
			actual   = t.f._cardList;
			assert.equals(actual, expected);
		},

		"get should return the card at the specified index, or -1 if out of bounds": function() {
			var actual, expected;
			t.f._cardList = ['test'];

			// in bounds
			actual   = t.f.get(0);
			expected = 'test';
			assert.equals(actual, expected);

			// out of bounds: too low
			actual   = t.f.get(-50);
			expected = undefined;
			assert.equals(actual, expected);

			// out of bounds: too high
			actual   = t.f.get(1);
			expected = undefined;
			assert.equals(actual, expected);

		},

		"select should adds the passed index in _cardList to _selected, unless it's already selected, in which case it removes it": function() {
			var actual, expected;
			t.f._cardList = 'test'
			
			t.f.select(0);

			// add selected
			actual   = t.f._selected;
			expected = [0];
			assert.equals(actual, expected);

			// don't modify cardlist
			actual   = t.f._cardList;
			expected = 'test'
			assert.equals(actual, expected);

			// remove selected
			t.f.select(0);

			actual   = t.f._selected;
			expected = [];
			assert.equals(actual, expected);
		},

		"confirmSelection should return and empty _selected": function() {
			var actual, expected;
			t.f._selected = ['test1', 'test2'];

			actual = t.f.confirmSelection();
			expected = ['test1', 'test2'];
			assert.equals(actual, expected);

			actual = t.f._selected;
			expected = [];
			assert.equals(actual, expected);
		},


		"getSelection should return all selected and unselected cards of the specified deck via the passed arrays": function() {
			var actual, expected;
			var selectedCard1 = { selected: true, select: sinon.stub() };
			var selectedCard2 = { selected: true, select: sinon.stub() };
			var unselectedCard1 = { selected: false, select: sinon.stub() };
			var unselectedCard2 = { selected: false, select: sinon.stub() };
			var selectedCards = [];
			var unselectedCards = [];

			t.f._cardList = [selectedCard1, unselectedCard1, selectedCard2, unselectedCard2];

			t.f.getSelection(selectedCards, unselectedCards);

			actual   = selectedCards;
			expected = [selectedCard1, selectedCard2];
			assert.equals(actual, expected);


			actual   = unselectedCards;
			expected = [unselectedCard1, unselectedCard2];
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete t.f;
		}
	},

	"PlayerCards.js tests": {
		setup: function() {
			var PlayerCards = require(dir + 'player/playercards');
			t.f = new PlayerCards();
		},

		"_drawCard with no specified deck should draw cards from the draw deck and add them to the hand": function() {
			var actual, expected;
			var drawStub = sinon.stub();
			var addStub  = sinon.stub();
			var lengthStub = sinon.stub();
			lengthStub.onFirstCall().returns(2).onSecondCall().returns(1);
			t.f._draw = { draw: drawStub, length: lengthStub }
			t.f._hand = { add: addStub, length: lengthStub }

			// t.f._draw._cardList = ['test1', 'test2'];

			t.f._drawCard();
			t.f._drawCard(2);

			actual = drawStub.calledTwice && addStub.calledTwice;
			assert.isTrue(actual);

			actual = drawStub.calledWithExactly(2);
			assert.isTrue(actual);
		},

		"_drawCard should call shuffleDiscardIntoDraw if there are no cards to draw": function() {
			var actual, expected;
			var drawLengthStub = sinon.stub();
			drawLengthStub.returns(0);
			var shuffleDiscardStub = sinon.stub(t.f, "_shuffleDiscardIntoDraw");

			t.f._draw = { draw: sinon.stub(), length: drawLengthStub };
			t.f._discard ={ shuffle: sinon.stub(), addTo: sinon.stub() }

			// draw a card
			t.f._drawCard();
			t.f._shuffleDiscardIntoDraw.restore();

			actual = shuffleDiscardStub.calledOnce;
			assert.isTrue(actual);
		},

		"drawCards should draw the specified number of cards and publishes a deck change event": function() {
			var actual, expected;
			var drawStub = sinon.stub(t.f, "_drawCard");
			var publishStub = sinon.stub(t.f, "_publishDeckChange");

			t.f.drawCards(3);

			t.f._drawCard.restore();
			t.f._publishDeckChange.restore();

			actual   = drawStub.callCount;
			expected = 3;
			assert.equals(actual, expected);

			actual   = publishStub.callCount;
			expected = 1;
			assert.equals(actual, expected);
		},

		"drawNewHand should call discardHand and drawCards on hand, and publish a deck change": function() {
			var actual, expected;
			var discardStub = sinon.stub(t.f, 'discardHand');
			var drawStub    = sinon.stub(t.f, 'drawCards');
			var publishStub = sinon.stub(t.f, "_publishDeckChange");

			t.f.drawNewHand();

			t.f.discardHand.restore();
			t.f.drawCards.restore();
			t.f._publishDeckChange.restore();

			actual = discardStub.calledOnce;
			assert.isTrue(actual);

			actual = drawStub.calledOnce;
			assert.isTrue(actual);

			actual = publishStub.calledOnce;
			assert.isTrue(actual);
		},

		"getSelection should call getSelection on the correct deck": function() {
			var actual, expected;
			var getSelectedCardsStub = sinon.stub();
			t.f._testDeck = { getSelection: getSelectedCardsStub };

			t.f.getSelection('testDeck', 1, 2);

			actual = getSelectedCardsStub.calledOnce && getSelectedCardsStub.calledWithExactly(1, 2);
			assert.isTrue(actual);
		},

		teardown: function() {
			delete t.f;
		}
	},

	"Skill.js tests": {
		setup: function() {
			t.f = require(dir + 'entities/skill');
		},



		teardown: function() {
			delete t.f;
		}
	},

	"SkillBuilder.js tests": {
		setup: function() {
			var SkillBuilder = require(dir + 'entities/skillbuilder');
			t.f = SkillBuilder.does();
		},

		"to sets targets to the passed argument for the current index": function() {
			var actual, expected;
			t.f.targeting = [];

			t.f.to('test1');

			actual   = t.f.targeting[t.f._index];
			expected = 'test1';
			assert.equals(actual, expected);
		},

		"and sets this._and to true": function() {
			var actual, expected;
			var before = t.f._and;

			t.f.and();

			actual   = t.f._and;
			expected = true;
			assert.equals(actual, expected);

			t.f._and = before;
		},

		"then increments _index": function() {
			var actual, expected;
			var before = t.f._index;
			
			t.f.then();

			actual   = t.f._index;
			expected = before + 1;
			assert.equals(actual, expected);

			t.f._index = before;
		},

		"withPowerCoefficient sets the 0th index of coefficients to the passed argument for the current index": function()  {
			var actual, expected;
			t.f.coefficients = [[0, 0]];
			t.f._index = 0;

			t.f.withPowerCoefficient('test2');

			actual   = t.f.coefficients[t.f._index][0];
			expected = 'test2';
			assert.equals(actual, expected);
		},

		"withCDRCoefficient sets the 1st index of coefficients to the passed argument for the current index": function()  {
			var actual, expected;
			t.f.coefficients = [[0, 0]];
			t.f._index = 0;

			t.f.withCDRCoefficient('test2');

			actual   = t.f.coefficients[t.f._index][1];
			expected = 'test2';
			assert.equals(actual, expected);
		},

		"_initEffectsTargetsAndCoeffs initializes effects to [], coefficients to [0, 0], and target to 'self' for this index but only if they're not already set": function() {
			var actual, expected;
			t.f.coefficients = [];
			t.f.targeting = [];
			t.f.effects = [];

			t.f._initEffectsTargetsAndCoeffs(0);

			// unset

			actual   = t.f.effects[0];
			expected = [];
			assert.equals(actual, expected);

			actual   = t.f.coefficients[0];
			expected = [0, 0];
			assert.equals(actual, expected);

			actual   = t.f.targeting[0];
			expected = 'self';
			assert.equals(actual, expected);

			// set 
			t.f.effects = ['testeffects'];
			t.f.coefficients = ['testcoeffs'];
			t.f.targeting = ['testtargets'];


			t.f._initEffectsTargetsAndCoeffs(0);

			actual   = t.f.effects[0];
			expected = 'testeffects';
			assert.equals(actual, expected);		

			actual   = t.f.coefficients[0];
			expected = 'testcoeffs';
			assert.equals(actual, expected);

			actual   = t.f.targeting[0];
			expected = 'testtargets';
			assert.equals(actual, expected);

		},

		"_addEffect calls _init on this._index; if this._and is false, sets the effect for _index to the passed function; else sets _and to false pushes passed function to effects[_index]": function() {
			var actual, expected;
			var initStub = sinon.stub(t.f, '_initEffectsTargetsAndCoeffs');
			var fn1 = 'test function 1';
			var fn2 = 'test function 2';
			t.f._and = false;
			t.f._index = 0;
			t.f.effects = [['test function 3']];

			t.f._addEffect(fn1);
			t.f._initEffectsTargetsAndCoeffs.restore();

			actual = initStub.calledOnce;
			assert.isTrue(actual);

			actual   = t.f.effects[0];
			expected = ['test function 1'];
			assert.equals(actual, expected);

			initStub = sinon.stub(t.f, '_initEffectsTargetsAndCoeffs');
			t.f._and = true;
			t.f._index = 0;
			t.f.effects = [['test function 3']];

			t.f._addEffect(fn2);
			t.f._initEffectsTargetsAndCoeffs.restore();

			actual = initStub.calledOnce;
			assert.isTrue(actual);

			actual   = t.f.effects[0];
			expected = ['test function 3', 'test function 2'];
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete t.f;
		}
	},

	"TargetingBuilder.js tests": {
		setup: function() {
			var TargetingBuilder = require(dir + 'entities/targetingbuilder');
			t.f = TargetingBuilder.targets();
		},

		"_inLine returns tiles targetable by a line-targeting skill": function() {
			var actual, expected;

			var fn = t.f._inLine(2);

			var source = { x: 0, y: 0 };
			var offset = { x: 0, y: 0 };
			var dirs = 'urdl';

			var actual   = fn(source, offset, dirs);
			var expected = [[[0, 1],[0, 2]], [[1, 0],[2, 0]], [[0, -1],[0, -2]], [[-1, 0],[-2, 0]]];
			assert.equals(actual, expected);

			var source = { x: -5, y: 5 };
			var offset = { x: 2, y: -1 };
			var dirs = 'ul';

			var actual   = fn(source, offset, dirs);
			var expected = [[[-3, 5],[-3, 6]], [[-4, 4],[-5, 4]]];
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete t.f;
		}
	},

	"Calc.js tests": {
		setup: function() {
			t.f = require(dir + 'util/calc');
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

			actual   = t.f.distanceBetweenPoints(p1, p2)
			expected = 4;
			assert.equals(actual, expected);

			actual   = t.f.distanceBetweenPoints(p3, p4)
			expected = 0;
			assert.equals(actual, expected);

			actual   = t.f.distanceBetweenPoints(p5, p6);
			expected = 24;
			assert.equals(actual, expected);

		},

		"getLine returns a line from origin to end of the specified length (number of points)": function() {
			var actual, expected;
			
			actual   = t.f.getLine(0, 0, 0, 5, 3);
			expected = [[0, 0], [0, 1], [0, 2]];
			assert.equals(actual, expected);

			// no length specified = full line
			actual   = t.f.getLine(-5, -5, 0, 0);
			expected = [[-5, -5], [-4, -4], [-3, -3], [-2, -2], [-1, -1], [0, 0]];
			assert.equals(actual, expected);
		},

		"getEndPoint returns the correct endpoint given a point of origin, length, and direction": function() {
			var actual, expected;

			actual   = t.f.getEndPoint(0, 0, 5, 'u');
			expected = [0, 5];
			assert.equals(actual, expected);

			actual   = t.f.getEndPoint(-5, 0, 5, 'l');
			expected = [-10, 0];
			assert.equals(actual, expected);

			actual   = t.f.getEndPoint(-3.54, 1, 100, 'd');
			expected = [-3.54, -99];
			assert.equals(actual, expected);

			actual   = t.f.getEndPoint(-20, 20, 20, 'r');
			expected = [0, 20];
			assert.equals(actual, expected);
		},

		teardown: function() {
			delete t.f;
		}
	}
};