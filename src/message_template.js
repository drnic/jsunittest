DrNicTest.Unit.MessageTemplate = function(string) {
  var parts = [];
  (string || '').scan(/(?=[^\\])\?|(?:\\\?|[^\?])+/, function(part) {
    parts.push(part[0]);
  });
  this.parts = parts;
};

DrNicTest.Unit.MessageTemplate.prototype.evaluate = function(params) {
  return this.parts.map(function(part) {
    return part == '?' ? DrNicTest.Unit.inspect(params.shift()) : part.replace(/\\\?/, '?');
  }).join('');
};
