Object.prototype.inspect = function(object) {
  try {
    if (typeof object == "undefined") return 'undefined';
    if (object === null) return 'null';
    return object.inspect ? object.inspect() : String(object);
  } catch (e) {
    if (e instanceof RangeError) return '...';
    throw e;
  }
}

var DrNicTest = {
  Unit: {
    inspect: Object.inspect // security exception workaround
  },
  $: function(element) {
    if (arguments.length > 1) {
      for (var i = 0, elements = [], length = arguments.length; i < length; i++)
        elements.push(this.$(arguments[i]));
      return elements;
    }
    if (typeof element == "string")
      element = document.getElementById(element);
    return element;
  },
  gsub: function(source, pattern, replacement) {
    var result = '', match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += DrNicTest.String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  },
  escapeHTML: function(data) {
    return data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
  String: {
    interpret: function(value) {
      return value == null ? '' : String(value);
    }
  }
};

DrNicTest.gsub.prepareReplacement = function(replacement) {
  if (typeof replacement == "function") return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
};