$(document).ready(function() {
	if (!mndltest) { return; }
	mndltest.runTests(tests);
})

dispatchEvent = function() {

}

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

			handleInputSpy.restore();

			assert.equals(actual, expected);
		},

		"bindEvents should add event to inputActions and bind context correctly": function() {
			var actual;
			var fnSpy = sinon.spy();
			var context = { id: 'context' }
			context.activeDialog = sinon.stub().returns(undefined);
			var eventType = 'test'

			var input = {
				test: {
					context: context,
					eventType: eventType,
					fn: fnSpy
				}
			}
			this.f2.bindEvents(input);

			this.f2._inputActions[eventType][test](); 

			actual = fnSpy.calledOnce
			assert.isTrue(actual);
			
			actual = fnSpy.alwaysCalledOn(context);
			assert.isTrue(actual);
		},

		"bindEvents should bind events to active dialogs": function() {
			var actual;
			var fnSpy = sinon.spy();
			var eventType = 'test'
			var context1 = { id: 'context1' };
			var context2 = { id: 'context2' };
			context1.activeDialog = sinon.stub().returns(context2);

			var input = {
				test: {
					context: context1,
					eventType: eventType,
					fn: fnSpy
				}
			}

			this.f2.bindEvents(input);

			this.f2._inputActions[eventType][test]();

			actual = fnSpy.calledOnce;
			assert.isTrue(actual);

			actual = !fnSpy.calledOn(context1);
			assert.isTrue(actual);

			actual = fnSpy.alwaysCalledOn(context2);
			assert.isTrue(actual);
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

		"getElementsByCoords should use areCoordsInBounds to return a list of elements within passed coordinates": function() {
			var actual, expected;
			var e1 = { _size: { height: 1, width: 1 }, _position: { x: 0, y: 0 } };
			var e2 = { _size: { height: 1, width: 1 }, _position: { x: 0, y: 0 } };
			var e3 = { _size: { height: 1, width: 1 }, _position: { x: 2, y: 2 } };
			this.f._elements = [e1, e2, e3];
			var mouseUtilsSpy = sinon.spy(Game.MouseUtils, "coordsAreInBounds");
			var coords = { x: 0, y: 0 };
			
			actual = this.f.getElementsByCoords(coords);
			expected = [e2, e3];
			assert.equals(actual, expected);

			actual = mouseUtilsSpy.callCount;
			expected = 3;
			assert.equals(actual, expected);

			coords = { x: 4, y: 4 };

			actual = this.f.getElementsByCoords(coords);
			expected = [];
			assert.equals(actual, expected);
		},	

		teardown: function() {
			delete this.f;
		}

	}
};