// $(document).ready(function() {
// 	test('Game.js tests', function() {
// 		var setup, expected, actual, description, teardown;

// 		setup = function() {
// 			console.log(this);
// 			var g = new Game();
// 		};

// 		setup();
// 		actual = g instanceof Game.UserInterface;
// 		expected = true;
// 		description = 'UI properly instantiated';
// 		assert.equals(actual, expected, description);

// 		actual = Game.guis['overlay'] instanceof Game.UserInterface;
// 		expected = true;
// 		description = 'Overlay properly instantiated';
// 		assert.equals(actual, expected, description);

// 	});

// 	test('InputManager.js tests', function() {
// 		var setup, expected, actual, description, teardown;

// 		(setup = function() {
// 			var im = new InputManager();
// 		})();
// 		assert.equals(Game.guis['ui'] instanceof Game.UserInterface, true, 'UI properly instantiated');
// 		assert.equals(Game.guis['overlay'] instanceof Game.UserInterface, true, 'overlay properly instantiated');
// 	});
// });]

$(document).ready(function() {
	mndltest.runTests(tests);
})

tests = {
	"Game.js tests": {
		setup: function() { 
			this.f = new Game.NewGame(); 
		},

		"NewGame constructor should return newGame object": function() {
			var actual,

			actual = this.f instanceof Game.NewGame;

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
			this.f = new Game.InputManager();
		},

		"InputManager constructor should return InputManager object": function() {
			var actual;

			actual = this.f instanceof Game.InputManager;

			assert.isTrue(actual);
		},

		teardown: function() {
		 	delete this.f;
		}
	}
};