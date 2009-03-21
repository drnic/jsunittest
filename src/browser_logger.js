JsUnitTest.Unit.BrowserLogger = {
  logger: null
};

JsUnitTest.Unit.BrowserLogger.forCurrentBrowser = function() {
  if (this.logger) { return this.logger; }
  if (typeof fireunit != "undefined" && fireunit) { 
    this.logger = new JsUnitTest.Unit.BrowserLogger.FirefoxFireunitLogger();
  } else {
    this.logger = new JsUnitTest.Unit.BrowserLogger.NoBrowserSupportLogger();
  }
  return this.logger;
};

// All the BrowserLogger instances have the same API, which is stubbed out for the 
// case where the current browser has no in-built/plugin test harness
JsUnitTest.Unit.BrowserLogger.NoBrowserSupportLogger = function() {};
JsUnitTest.Unit.BrowserLogger.NoBrowserSupportLogger.prototype.finish = function(status, message) {};

JsUnitTest.Unit.BrowserLogger.FirefoxFireunitLogger = function() {
  if (typeof fireunit == "undefined" || !fireunit) { throw "fireunit not available"; }
  
};

JsUnitTest.Unit.BrowserLogger.FirefoxFireunitLogger.prototype.finish = function(status, message) {
  fireunit.ok(!!status, message);
};

