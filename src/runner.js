DrNicTest.Unit.Runner = function(testcases) {
  var options = this.options = Object.extend({
    testLog: 'testlog'
  }, arguments[1] || {});
  
  options.resultsURL = this.queryParams.resultsURL;
  options.testLog = $(options.testLog);
  
  this.tests = this.getTests(testcases);
  this.currentTest = 0;
  this.logger = new DrNicTest.Unit.Logger(options.testLog);
  Event.observe(window, "load", function() {
    this.runTests.bind(this).delay(0.1);
  }.bind(this));
};

DrNicTest.Unit.Runner.prototype.queryParams = window.location.search.parseQuery;

DrNicTest.Unit.Runner.prototype.getTests = function(testcases) {
  var tests, options = this.options;
  if (this.queryParams.tests) tests = this.queryParams.tests.split(',');
  else if (options.tests) tests = options.tests;
  else if (options.test) tests = [option.test];
  else tests = Object.keys(testcases).grep(/^test/);
  
  return tests.map(function(test) {
    if (testcases[test])
      return new DrNicTest.Unit.Testcase(test, testcases[test], testcases.setup, testcases.teardown);
  }).compact();
};

DrNicTest.Unit.Runner.prototype.getResult = function() {
  var results = {
    tests: this.tests.length,
    assertions: 0,
    failures: 0,
    errors: 0
  };
  
  return this.tests.inject(results, function(results, test) {
    results.assertions += test.assertions;
    results.failures   += test.failures;
    results.errors     += test.errors;
    return results;
  });
};

DrNicTest.Unit.Runner.prototype.postResults = function() {
  if (this.options.resultsURL) {
    new Ajax.Request(this.options.resultsURL, 
      { method: 'get', parameters: this.getResult(), asynchronous: false });
  }
};

DrNicTest.Unit.Runner.prototype.runTests = function() {
  var test = this.tests[this.currentTest], actions;
  
  if (!test) return this.finish();
  if (!test.isWaiting) this.logger.start(test.name);
  test.run();
  if(test.isWaiting) {
    this.logger.message("Waiting for " + test.timeToWait + "ms");
    setTimeout(this.runTests.bind(this), test.timeToWait || 1000);
    return;
  }
  
  this.logger.finish(test.status(), test.summary());
  if (actions = test.actions) this.logger.appendActionButtons(actions);
  this.currentTest++;
  // tail recursive, hopefully the browser will skip the stackframe
  this.runTests();
};

DrNicTest.Unit.Runner.prototype.finish = function() {
  this.postResults();
  this.logger.summary(this.summary());
};

DrNicTest.Unit.Runner.prototype.summary = function() {
  return '#{tests} tests, #{assertions} assertions, #{failures} failures, #{errors} errors'
    .interpolate(this.getResult());
};
