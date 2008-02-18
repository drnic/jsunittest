DrNicTest.Unit.MessageTemplate = function(string) {
  var parts = [];
  var str = DrNicTest.scan((string || ''), /(?=[^\\])\?|(?:\\\?|[^\?])+/, function(part) {
    parts.push(part[0]);
  });
  this.parts = parts;
};

DrNicTest.Unit.MessageTemplate.prototype.evaluate = function(params) {
  var results = [];
  for (var i=0; i < this.parts.length; i++) {
    var part = this.parts[i];
    var result = (part == '?') ? DrNicTest.inspect(params.shift()) : part.replace(/\\\?/, '?');
    results.push(result);
  };
  return results.join('');
};
