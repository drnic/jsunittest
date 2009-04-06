JsUnitTest.Unit.Runner = function(testcases) {
  var argumentOptions = arguments[1] || {};
  var options = this.options = {};
  options.testLog = ('testLog' in argumentOptions) ? argumentOptions.testLog : 'testlog';
  options.resultsURL = this.queryParams.resultsURL;
  options.testLog = JsUnitTest.$(options.testLog);
  
  this.tests = this.getTests(testcases);
  this.currentTest = 0;
  this.logger = new JsUnitTest.Unit.Logger(options.testLog);
  
  var self = this;
  JsUnitTest.Event.addEvent(window, "load", function() {
    setTimeout(function() {
      self.runTests();
    }, 0.1);
  });
};

JsUnitTest.Unit.Runner.prototype.queryParams = JsUnitTest.toQueryParams();

JsUnitTest.Unit.Runner.prototype.portNumber = function() {
  if (window.location.search.length > 0) {
    var matches = window.location.search.match(/\:(\d{3,5})\//);
    if (matches) {
      return parseInt(matches[1], 10);
    }
  }
  return null;
};

JsUnitTest.Unit.Runner.prototype.getTests = function(testcases) {
  var tests = [], options = this.options;
  if (this.queryParams.tests) {tests = this.queryParams.tests.split(',');}
  else if (options.tests) {tests = options.tests;}
  else if (options.test) {tests = [option.test];}
  else {
    for (testname in testcases) {
      if (testname.match(/^test/)) {tests.push(testname);}
    }
  }
  var results = [];
  for (var i=0; i < tests.length; i++) {
    var test = tests[i];
    if (testcases[test]) {
      results.push(
        new JsUnitTest.Unit.Testcase(test, testcases[test], testcases.setup, testcases.teardown)
      );
    }
  }
  return results;
};

JsUnitTest.Unit.Runner.prototype.getResult = function() {
  var results = {
    tests: this.tests.length,
    assertions: 0,
    failures: 0,
    errors: 0,
    warnings: 0
  };
  
  for (var i=0; i < this.tests.length; i++) {
    var test = this.tests[i];
    results.assertions += test.assertions;
    results.failures   += test.failures;
    results.errors     += test.errors;
    results.warnings   += test.warnings;
  }
  return results;
};

JsUnitTest.Unit.Runner.prototype.postResults = function() {
  if (this.options.resultsURL) {
    // new Ajax.Request(this.options.resultsURL, 
    //   { method: 'get', parameters: this.getResult(), asynchronous: false });
    var results = this.getResult();
    var url = this.options.resultsURL + "?";
    url += "tests="+ this.tests.length + "&";
    url += "assertions="+ results.assertions + "&";
    url += "warnings="  + results.warnings + "&";
    url += "failures="  + results.failures + "&";
    url += "errors="    + results.errors;
    JsUnitTest.ajax({
      url: url,
      type: 'GET'      
    });
  }
};

JsUnitTest.Unit.Runner.prototype.runTests = function() {
  var test = this.tests[this.currentTest], actions;
  
  if (!test) {return this.finish();}
  if (!test.isWaiting) {this.logger.start(test.name);}
  test.run();
  var self = this;
  if(test.isWaiting) {
    this.logger.message("Waiting for " + test.timeToWait + "ms");
    // setTimeout(this.runTests.bind(this), test.timeToWait || 1000);
    setTimeout(function() {
      self.runTests();
    }, test.timeToWait || 1000);
    return;
  }
  
  this.logger.finish(test.status(), test.summary());
  if (actions = test.actions) {this.logger.appendActionButtons(actions);}
  this.currentTest++;
  // tail recursive, hopefully the browser will skip the stackframe
  this.runTests();
};

JsUnitTest.Unit.Runner.prototype.finish = function() {
  this.postResults();
  this.logger.summary(this.summary());
};

JsUnitTest.Unit.Runner.prototype.summary = function() {
  return new JsUnitTest.Template('#{tests} tests, #{assertions} assertions, #{failures} failures, #{errors} errors, #{warnings} warnings').evaluate(this.getResult());
};
