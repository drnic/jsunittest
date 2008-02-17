Test.Unit.MessageTemplate = function() {};
Test.Unit.MessageTemplate.prototype.initialize = function(string) {
  var parts = [];
  (string || '').scan(/(?=[^\\])\?|(?:\\\?|[^\?])+/, function(part) {
    parts.push(part[0]);
  });
  this.parts = parts;
};

Test.Unit.MessageTemplate.prototype.evaluate = function(params) {
  return this.parts.map(function(part) {
    return part == '?' ? Test.Unit.inspect(params.shift()) : part.replace(/\\\?/, '?');
  }).join('');
};
