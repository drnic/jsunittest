JsUnitTest.Unit.BrowserLogger = {
  logger: null
};

JsUnitTest.Unit.BrowserLogger.forCurrentBrowser = function() {
  if (this.logger) { return this.logger; }
  if (typeof fireunit != "undefined" && fireunit) { 
    this.logger = new JsUnitTest.Unit.BrowserLogger.FirefoxFireunit();
  }
  return this.logger;
};

JsUnitTest.Unit.BrowserLogger.FirefoxFireunit = function() {
  if (typeof fireunit == "undefined" || !fireunit) { throw "fireunit not available"; }
  
};

JsUnitTest.Unit.BrowserLogger.FirefoxFireunit.prototype.finish = function(status, message) {
  fireunit.ok(!!status, message);
};
