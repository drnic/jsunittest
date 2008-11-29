JsUnitTest.Unit.Testcase = function(name, test, setup, teardown) {
  this.name           = name;
  this.test           = test     || function() {};
  this.setup          = setup    || function() {};
  this.teardown       = teardown || function() {};
  this.messages       = [];
  this.actions        = {};
};
// import JsUnitTest.Unit.Assertions

for (method in JsUnitTest.Unit.Assertions) {
  JsUnitTest.Unit.Testcase.prototype[method] = JsUnitTest.Unit.Assertions[method];
}

JsUnitTest.Unit.Testcase.prototype.isWaiting         = false;
JsUnitTest.Unit.Testcase.prototype.timeToWait        = 1000;
JsUnitTest.Unit.Testcase.prototype.assertions        = 0;
JsUnitTest.Unit.Testcase.prototype.failures          = 0;
JsUnitTest.Unit.Testcase.prototype.errors            = 0;
JsUnitTest.Unit.Testcase.prototype.warnings          = 0;
JsUnitTest.Unit.Testcase.prototype.isRunningFromRake = window.location.port;

// JsUnitTest.Unit.Testcase.prototype.isRunningFromRake = window.location.port == 4711;

JsUnitTest.Unit.Testcase.prototype.wait = function(time, nextPart) {
  this.isWaiting = true;
  this.test = nextPart;
  this.timeToWait = time;
};

JsUnitTest.Unit.Testcase.prototype.run = function(rethrow) {
  try {
    try {
      if (!this.isWaiting) this.setup();
      this.isWaiting = false;
      this.test();
    } finally {
      if(!this.isWaiting) {
        this.teardown();
      }
    }
  }
  catch(e) { 
    if (rethrow) throw e;
    this.error(e, this); 
  }
};

JsUnitTest.Unit.Testcase.prototype.summary = function() {
  var msg = '#{assertions} assertions, #{failures} failures, #{errors} errors, #{warnings} warnings\n';
  return new JsUnitTest.Template(msg).evaluate(this) + 
    this.messages.join("\n");
};

JsUnitTest.Unit.Testcase.prototype.pass = function() {
  this.assertions++;
};

JsUnitTest.Unit.Testcase.prototype.fail = function(message) {
  this.failures++;
  var line = "";
  try {
    throw new Error("stack");
  } catch(e){
    line = (/\.html:(\d+)/.exec(e.stack || '') || ['',''])[1];
  }
  this.messages.push("Failure: " + message + (line ? " Line #" + line : ""));
};

JsUnitTest.Unit.Testcase.prototype.warning = function(message) {
  this.warnings++;
  var line = "";
  try {
    throw new Error("stack");
  } catch(e){
    line = (/\.html:(\d+)/.exec(e.stack || '') || ['',''])[1];
  }
  this.messages.push("Warning: " + message + (line ? " Line #" + line : ""));
};
JsUnitTest.Unit.Testcase.prototype.warn = JsUnitTest.Unit.Testcase.prototype.warning;

JsUnitTest.Unit.Testcase.prototype.info = function(message) {
  this.messages.push("Info: " + message);
};

JsUnitTest.Unit.Testcase.prototype.error = function(error, test) {
  this.errors++;
  this.actions['retry with throw'] = function() { test.run(true); };
  this.messages.push(error.name + ": "+ error.message + "(" + JsUnitTest.inspect(error) + ")");
  if( typeof console != "undefined" && console.error && console.warn && console.info) {
   console.error("Test '" + test.name + "' died, exception and test follows");
   console.info(error);
   console.warn(test.test.toString());
  }
};

JsUnitTest.Unit.Testcase.prototype.status = function() {
  if (this.failures > 0) return 'failed';
  if (this.errors > 0) return 'error';
  if (this.warnings > 0) return 'warning';
  return 'passed';
};

JsUnitTest.Unit.Testcase.prototype.benchmark = function(operation, iterations) {
  var startAt = new Date();
  (iterations || 1).times(operation);
  var timeTaken = ((new Date())-startAt);
  this.info((arguments[2] || 'Operation') + ' finished ' + 
     iterations + ' iterations in ' + (timeTaken/1000)+'s' );
  return timeTaken;
};
