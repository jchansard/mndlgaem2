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

		"init should initialize ui objects and start game tick": function() {
			var actual, expected;
			var tickStub = sinon.stub(this.f, "tick");
			var mocks = [];

			for (var gui in this.f.guis)
			{	
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

		teardown: undefined
	}
};