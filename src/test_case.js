Test.Unit.Testcase = function() {};
// import Test.Unit.Assertions

for (method in Test.Unit.Assertions) {
  Test.Unit.Testcase.prototype[method] = Test.Unit.Assertions[method];
}

Test.Unit.Testcase.prototype.initialize = function(name, test, setup, teardown) {
  this.name           = name;
  this.test           = test     || Prototype.emptyFunction;
  this.setup          = setup    || Prototype.emptyFunction;
  this.teardown       = teardown || Prototype.emptyFunction;
  this.messages       = [];
  this.actions        = {};
};

Test.Unit.Testcase.prototype.isWaiting  = false;
Test.Unit.Testcase.prototype.timeToWait = 1000;
Test.Unit.Testcase.prototype.assertions = 0;
Test.Unit.Testcase.prototype.failures   = 0;
Test.Unit.Testcase.prototype.errors     = 0;
Test.Unit.Testcase.prototype.isRunningFromRake = window.location.port == 4711; // TODO port # independent

Test.Unit.Testcase.prototype.wait = function(time, nextPart) {
  this.isWaiting = true;
  this.test = nextPart;
  this.timeToWait = time;
};

Test.Unit.Testcase.prototype.run = function(rethrow) {
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

Test.Unit.Testcase.prototype.summary = function() {
  var msg = '#{assertions} assertions, #{failures} failures, #{errors} errors\n';
  return msg.interpolate(this) + this.messages.join("\n");
};

Test.Unit.Testcase.prototype.pass = function() {
  this.assertions++;
};

Test.Unit.Testcase.prototype.fail = function(message) {
  this.failures++;
  var line = "";
  try {
    throw new Error("stack");
  } catch(e){
    line = (/\.html:(\d+)/.exec(e.stack || '') || ['',''])[1];
  }
  this.messages.push("Failure: " + message + (line ? " Line #" + line : ""));
};

Test.Unit.Testcase.prototype.info = function(message) {
  this.messages.push("Info: " + message);
};

Test.Unit.Testcase.prototype.error = function(error, test) {
  this.errors++;
  this.actions['retry with throw'] = function() { test.run(true) };
  this.messages.push(error.name + ": "+ error.message + "(" + Test.Unit.inspect(error) + ")");
};

Test.Unit.Testcase.prototype.status = function() {
  if (this.failures > 0) return 'failed';
  if (this.errors > 0) return 'error';
  return 'passed';
};

Test.Unit.Testcase.prototype.benchmark = function(operation, iterations) {
  var startAt = new Date();
  (iterations || 1).times(operation);
  var timeTaken = ((new Date())-startAt);
  this.info((arguments[2] || 'Operation') + ' finished ' + 
     iterations + ' iterations in ' + (timeTaken/1000)+'s' );
  return timeTaken;
};