JsUnitTest.Unit.Logger = function(element) {
  this.element = JsUnitTest.$(element);
  if (this.element) {this._createLogTable();}
};
  
JsUnitTest.Unit.Logger.prototype.start = function(testName) {
  if (!this.element) {return;}
  var tbody = this.element.getElementsByTagName('tbody')[0];
  
  var tr = document.createElement('tr');
  var td;
  
  //testname
  td = document.createElement('td');
  td.appendChild(document.createTextNode(testName));
  tr.appendChild(td);
  
  tr.appendChild(document.createElement('td'));//status
  tr.appendChild(document.createElement('td'));//message
  
  tbody.appendChild(tr);
};
  
JsUnitTest.Unit.Logger.prototype.setStatus = function(status) {
  var logline = this.getLastLogLine();
  logline.className = status;
  var statusCell = logline.getElementsByTagName('td')[1];
  statusCell.appendChild(document.createTextNode(status));
};
  
JsUnitTest.Unit.Logger.prototype.finish = function(status, summary) {
  if (!this.element) {return;}
  this.setStatus(status);
  this.message(summary);
};
  
JsUnitTest.Unit.Logger.prototype.message = function(message) {
  if (!this.element) {return;}
  var cell = this.getMessageCell();
  
  // cell.appendChild(document.createTextNode(this._toHTML(message)));
  cell.innerHTML = this._toHTML(message);
};
  
JsUnitTest.Unit.Logger.prototype.summary = function(summary) {
  if (!this.element) {return;}
  var div = this.element.getElementsByTagName('div')[0];
  div.innerHTML = this._toHTML(summary);
};
  
JsUnitTest.Unit.Logger.prototype.getLastLogLine = function() {
  var tbody = this.element.getElementsByTagName('tbody')[0];
  var loglines = tbody.getElementsByTagName('tr');
  return loglines[loglines.length - 1];
};
  
JsUnitTest.Unit.Logger.prototype.getMessageCell = function() {
  var logline = this.getLastLogLine();
  return logline.getElementsByTagName('td')[2];
};
  
JsUnitTest.Unit.Logger.prototype._createLogTable = function() {
  var html = '<div class="logsummary">running...</div>' +
  '<table class="logtable">' +
  '<thead><tr><th>Status</th><th>Test</th><th>Message</th></tr></thead>' +
  '<tbody class="loglines"></tbody>' +
  '</table>';
  this.element.innerHTML = html;
};
  
JsUnitTest.Unit.Logger.prototype.appendActionButtons = function(actions) {
  // actions = $H(actions);
  // if (!actions.any()) return;
  // var div = new Element("div", {className: 'action_buttons'});
  // actions.inject(div, function(container, action) {
  //   var button = new Element("input").setValue(action.key).observe("click", action.value);
  //   button.type = "button";
  //   return container.insert(button);
  // });
  // this.getMessageCell().insert(div);
};
  
JsUnitTest.Unit.Logger.prototype._toHTML = function(txt) {
  return JsUnitTest.escapeHTML(txt).replace(/\n/g,"<br/>");
};

