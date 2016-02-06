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

		"render clears the screen and calls render on this and each of this's elements": function() {
			var actual, expected;
			var renderStub = sinon.stub();
			var clearDisplayStub = sinon.stub(this.f, "clearDisplay");
			var el1 = { render: renderStub };
			var el2 = { render: renderStub };
			var el3 = { render: renderStub };

			this.f.renderCurrentScreen = renderStub;
			this.f._elements = [el1, el2, el3];

			this.f.render();

			actual = clearDisplayStub.callCount;
			expected = 1;
			assert.equals(actual, expected);

			actual = renderStub.calledOn(this.f);
			assert.isTrue(actual);

			actual = renderStub.callCount;
			expected = 4;
			assert.equals(actual, expected);

			actual = renderStub.calledOn(el1);
			assert.isTrue(actual);

			actual = renderStub.calledOn(el2);
			assert.isTrue(actual);

			actual = renderStub.calledOn(el3);
			assert.isTrue(actual);

			this.f.clearDisplay.restore();

		},

		"getClickedElements should use areCoordsInBounds to return a list of elements within passed coordinates": function() {
			var actual, expected;
			var el1 = { _size: { height: 1, width: 1 }, _position: { x: 0, y: 0 } };
			var el2 = { _size: { height: 1, width: 1 }, _position: { x: 0, y: 0 } };
			var el3 = { _size: { height: 1, width: 1 }, _position: { x: 2, y: 2 } };
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

		"addElement should add and bind an element to a gui and set it to be the active element when appropriate": function() {
			var actual, expected;
			var bindStub = sinon.stub();
			var setActiveStub = sinon.stub(this.f, "setActiveElement");
			var el = { bindToGui: bindStub }
			this.f._elements = [];

			this.f.addElement(el);

			// should add el
			actual = this.f._elements;
			expected = [el];
			assert.equals(actual, expected);

			// should have set el to active
			actual = setActiveStub.calledOnce && setActiveStub.calledWithExactly(0);
			assert.isTrue(actual);

			// add another element
			this.f.addElement(el);

			// set active shouldn't have been called, since it wasn't the first element and no override was passed
			actual = setActiveStub.calledOnce;
			assert.isTrue(actual);

			// add a third element, this time with override
			this.f.addElement(el, true);

			// set active should have been called, since activeByDefault is true
			actual = setActiveStub.calledTwice && setActiveStub.calledWithExactly(2);
			assert.isTrue(actual);

			// validate final state of elements
			actual = this.f._elements;
			expected = [el, el, el];
			assert.equals(actual, expected);

			// bind should have been called three times
			actual = bindStub.callCount;
			expected = 3;
			assert.equals(actual, expected);

			this.f.setActiveElement.restore();
		},

		"addElement should call the element's init function, if it exists, and continue if it doesn't": function() {
			var actual, expected;
			var initStub = sinon.stub();
			var el1 = { bindToGui: sinon.stub(), init: initStub };
			var el2 = { bindToGui: sinon.stub() };

			this.f.addElement(el1);

			actual = initStub.calledOnce && initStub.calledOn(el1);
			assert.isTrue(actual);

			this.f.addElement(el2);

			actual = initStub.calledOnce && !initStub.calledOn(el2);
			assert.isTrue(actual);
		},

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

	"MenuPrompt.js tests": {
		setup: function() {
			this.f = new Game.MenuPrompt();
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
	}
};