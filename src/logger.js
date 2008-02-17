Test.Unit.Logger = function() {};
Test.Unit.Logger.prototype.initialize = function(element) {
  this.element = $(element);
  if (this.element) this._createLogTable();
};
  
Test.Unit.Logger.prototype.start = function(testName) {
  if (!this.element) return;
  this.element.down('tbody').insert('<tr><td>' + testName + '</td><td></td><td></td></tr>');
};
  
Test.Unit.Logger.prototype.setStatus = function(status) {
  this.getLastLogLine().addClassName(status).down('td', 1).update(status);
};
  
Test.Unit.Logger.prototype.finish = function(status, summary) {
  if (!this.element) return;
  this.setStatus(status);
  this.message(summary);
};
  
Test.Unit.Logger.prototype.message = function(message) {
  if (!this.element) return;
  this.getMessageCell().update(this._toHTML(message));
};
  
Test.Unit.Logger.prototype.summary = function(summary) {
  if (!this.element) return;
  this.element.down('div').update(this._toHTML(summary));
};
  
Test.Unit.Logger.prototype.getLastLogLine = function() {
  return this.element.select('tr').last()
};
  
Test.Unit.Logger.prototype.getMessageCell = function() {
  return this.getLastLogLine().down('td', 2);
};
  
Test.Unit.Logger.prototype._createLogTable = function() {
  var html = '<div class="logsummary">running...</div>' +
  '<table class="logtable">' +
  '<thead><tr><th>Status</th><th>Test</th><th>Message</th></tr></thead>' +
  '<tbody class="loglines"></tbody>' +
  '</table>';
  this.element.update(html);
  
};
  
Test.Unit.Logger.prototype.appendActionButtons = function(actions) {
  actions = $H(actions);
  if (!actions.any()) return;
  var div = new Element("div", {className: 'action_buttons'});
  actions.inject(div, function(container, action) {
    var button = new Element("input").setValue(action.key).observe("click", action.value);
    button.type = "button";
    return container.insert(button);
  });
  this.getMessageCell().insert(div);
};
  
Test.Unit.Logger.prototype._toHTML = function(txt) {
  return txt.escapeHTML().replace(/\n/g,"<br/>");
};

