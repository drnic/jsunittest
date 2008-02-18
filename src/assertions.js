DrNicTest.Unit.Assertions = {
  buildMessage: function(message, template) {
    var args = DrNicTest.arrayfromargs(arguments).slice(2);
    return (message ? message + '\n' : '') + 
      new DrNicTest.Unit.MessageTemplate(template).evaluate(args);
  },
  
  flunk: function(message) {
    this.assertBlock(message || 'Flunked', function() { return false });
  },
  
  assertBlock: function(message, block) {
    try {
      block.call(this) ? this.pass() : this.fail(message);
    } catch(e) { this.error(e) }
  },
  
  assert: function(expression, message) {
    message = this.buildMessage(message || 'assert', 'got <?>', expression);
    this.assertBlock(message, function() { return expression });
  },
  
  assertEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertEqual', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected == actual });
  },
  
  assertNotEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNotEqual', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected != actual });
  },
  
  assertEnumEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertEnumEqual', 'expected <?>, actual: <?>', expected, actual);
    var expected_array = DrNicTest.flattenArray(expected);
    var actual_array   = DrNicTest.flattenArray(actual);
    this.assertBlock(message, function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return false;
        };
        return true;
      }
      return false;
    });
  },
  
  assertEnumNotEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertEnumNotEqual', '<?> was the same as <?>', expected, actual);
    var expected_array = DrNicTest.flattenArray(expected);
    var actual_array   = DrNicTest.flattenArray(actual);
    this.assertBlock(message, function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return true;
        };
        return false;
      }
      return true;
    });
  },
  
  assertHashEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertHashEqual', 'expected <?>, actual: <?>', expected, actual);
    var expected_array = DrNicTest.flattenArray(DrNicTest.hashToSortedArray(expected));
    var actual_array   = DrNicTest.flattenArray(DrNicTest.hashToSortedArray(actual));
    var block = function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return false;
        };
        return true;
      }
      return false;
    };
    this.assertBlock(message, block);
  },
  
  assertHashNotEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertHashNotEqual', '<?> was the same as <?>', expected, actual);
    var expected_array = DrNicTest.flattenArray(DrNicTest.hashToSortedArray(expected));
    var actual_array   = DrNicTest.flattenArray(DrNicTest.hashToSortedArray(actual));
    // from now we recursively zip & compare nested arrays
    var block = function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return true;
        };
        return false;
      }
      return true;
    };
    this.assertBlock(message, block);
  },
  
  assertIdentical: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertIdentical', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected === actual });
  },
  
  assertNotIdentical: function(expected, actual, message) { 
    message = this.buildMessage(message || 'assertNotIdentical', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected !== actual });
  },
  
  assertNull: function(obj, message) {
    message = this.buildMessage(message || 'assertNull', 'got <?>', obj);
    this.assertBlock(message, function() { return obj === null });
  },
  
  assertNotNull: function(obj, message) {
    message = this.buildMessage(message || 'assertNotNull', 'got <?>', obj);
    this.assertBlock(message, function() { return obj !== null });
  },
  
  assertUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return typeof obj == "undefined" });
  },
  
  assertNotUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertNotUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return typeof obj != "undefined" });
  },
  
  assertNullOrUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertNullOrUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return obj == null });
  },
  
  assertNotNullOrUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertNotNullOrUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return obj != null });
  },
  
  assertMatch: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertMatch', 'regex <?> did not match <?>', expected, actual);
    this.assertBlock(message, function() { return new RegExp(expected).exec(actual) });
  },
  
  assertNoMatch: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNoMatch', 'regex <?> matched <?>', expected, actual);
    this.assertBlock(message, function() { return !(new RegExp(expected).exec(actual)) });
  },
  
  assertHidden: function(element, message) {
    message = this.buildMessage(message || 'assertHidden', '? isn\'t hidden.', element);
    this.assertBlock(message, function() { return element.style.display == 'none' });
  },
  
  assertInstanceOf: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertInstanceOf', '<?> was not an instance of the expected type', actual);
    this.assertBlock(message, function() { return actual instanceof expected });
  },
  
  assertNotInstanceOf: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNotInstanceOf', '<?> was an instance of the expected type', actual);
    this.assertBlock(message, function() { return !(actual instanceof expected) });
  },
  
  assertRespondsTo: function(method, obj, message) {
    message = this.buildMessage(message || 'assertRespondsTo', 'object doesn\'t respond to <?>', method);
    this.assertBlock(message, function() { return (method in obj && typeof obj[method] == 'function') });
  },

  assertRaise: function(exceptionName, method, message) {
    message = this.buildMessage(message || 'assertRaise', '<?> exception expected but none was raised', exceptionName);
    var block = function() {
      try { 
        method();
        return false;
      } catch(e) {
        if (e.name == exceptionName) return true;
        else throw e;
      }
    };
    this.assertBlock(message, block);
  },
  
  assertNothingRaised: function(method, message) {
    try { 
      method();
      this.assert(true, "Expected nothing to be thrown");
    } catch(e) {
      message = this.buildMessage(message || 'assertNothingRaised', '<?> was thrown when nothing was expected.', e);
      this.flunk(message);
    }
  },
  
  _isVisible: function(element) {
    element = DrNicTest.$(element);
    if(!element.parentNode) return true;
    this.assertNotNull(element);
    if(element.style && element.style.display == 'none')
      return false;
    
    return arguments.callee.call(this, element.parentNode);
  },
  
  assertVisible: function(element, message) {
    message = this.buildMessage(message, '? was not visible.', element);
    this.assertBlock(message, function() { return this._isVisible(element) });
  },
  
  assertNotVisible: function(element, message) {
    message = this.buildMessage(message, '? was not hidden and didn\'t have a hidden parent either.', element);
    this.assertBlock(message, function() { return !this._isVisible(element) });
  },
  
  // TODO assertElementsMatch
  assertElementsMatch: function() {
    var pass = true, expressions = DrNicTest.arrayfromargs(arguments);
    var elements = expressions.shift();
    if (elements.length != expressions.length) {
      message = this.buildMessage('assertElementsMatch', 'size mismatch: ? elements, ? expressions (?).', elements.length, expressions.length, expressions);
      this.flunk(message);
      pass = false;
    }
    for (var i=0; i < expressions.length; i++) {
      var expression = expressions[i];
      var element    = DrNicTest.$(elements[i]);
      if (DrNicTest.selectorMatch(expression, element)) {
        pass = true;
        break;
      }
      message = this.buildMessage('assertElementsMatch', 'In index <?>: expected <?> but got ?', index, expression, element);
      this.flunk(message);
      pass = false;
    };
    this.assert(pass, "Expected all elements to match.");
  },
  
  assertElementMatches: function(element, expression, message) {
    this.assertElementsMatch([element], expression);
  }
};
