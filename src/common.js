var JsUnitTest = {
  Unit: {},
  inspect: function(object) {
    try {
      if (typeof object == "undefined") return 'undefined';
      if (object === null) return 'null';
      if (typeof object == "string") {
        var useDoubleQuotes = arguments[1];
        var escapedString = this.gsub(object, /[\x00-\x1f\\]/, function(match) {
          var character = String.specialChar[match[0]];
          return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
        });
        if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
        return "'" + escapedString.replace(/'/g, '\\\'') + "'";
      };
      return String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
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
        result += JsUnitTest.String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  },
  scan: function(source, pattern, iterator) {
    this.gsub(source, pattern, iterator);
    return String(source);
  },
  escapeHTML: function(data) {
    return data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
  arrayfromargs: function(args) {
  	var myarray = new Array();
  	var i;

  	for (i=0;i<args.length;i++)
  		myarray[i] = args[i];

  	return myarray;
  },
  
  // from now we recursively zip & compare nested arrays
  areArraysEqual: function(expected, actual) {
    var expected_array = JsUnitTest.flattenArray(expected);
    var actual_array   = JsUnitTest.flattenArray(actual);
    if (expected_array.length == actual_array.length) {
      for (var i=0; i < expected_array.length; i++) {
        if (expected_array[i] != actual_array[i]) return false;
      };
      return true;
    }
    return false;
  },
  
  areArraysNotEqual: function(expected_array, actual_array) {
    return !this.areArraysEqual(expected_array, actual_array);
  },

  areHashesEqual: function(expected, actual) {
    var expected_array = JsUnitTest.hashToSortedArray(expected);
    var actual_array   = JsUnitTest.hashToSortedArray(actual);
    this.areArraysEqual(expected_array, actual_array);
  },
  
  areHashesNotEqual: function(expected, actual) {
    !this.areHashesNotEqual(expected_acutal);
  },
  
  hashToSortedArray: function(hash) {
    var results = [];
    for (key in hash) {
      results.push([key, hash[key]]);
    }
    return results.sort();
  },
  flattenArray: function(array) {
    var results = arguments[1] || [];
    for (var i=0; i < array.length; i++) {
      var object = array[i];
      if (object != null && typeof object == "object" &&
        'splice' in object && 'join' in object) {
          this.flattenArray(object, results);
      } else {
        results.push(object);
      }
    };
    return results;
  },
  selectorMatch: function(expression, element) {
    var tokens = [];
    var patterns = {
      // combinators must be listed first
      // (and descendant needs to be last combinator)
      laterSibling: /^\s*~\s*/,
      child:        /^\s*>\s*/,
      adjacent:     /^\s*\+\s*/,
      descendant:   /^\s/,

      // selectors follow
      tagName:      /^\s*(\*|[\w\-]+)(\b|$)?/,
      id:           /^#([\w\-\*]+)(\b|$)/,
      className:    /^\.([\w\-\*]+)(\b|$)/,
      pseudo:
  /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/,
      attrPresence: /^\[((?:[\w]+:)?[\w]+)\]/,
      attr:         /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
    };

    var assertions = {
      tagName: function(element, matches) {
        return matches[1].toUpperCase() == element.tagName.toUpperCase();
      },

      className: function(element, matches) {
        return Element.hasClassName(element, matches[1]);
      },

      id: function(element, matches) {
        return element.id === matches[1];
      },

      attrPresence: function(element, matches) {
        return Element.hasAttribute(element, matches[1]);
      },

      attr: function(element, matches) {
        var nodeValue = Element.readAttribute(element, matches[1]);
        return nodeValue && operators[matches[2]](nodeValue, matches[5] || matches[6]);
      }
    };
    var e = this.expression, ps = patterns, as = assertions;
    var le, p, m;

    while (e && le !== e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        p = ps[i];
        if (m = e.match(p)) {
          // use the Selector.assertions methods unless the selector
          // is too complex.
          if (as[i]) {
            tokens.push([i, Object.clone(m)]);
            e = e.replace(m[0], '');
          }
        }
      }
    }

    var match = true, name, matches;
    for (var i = 0, token; token = tokens[i]; i++) {
      name = token[0], matches = token[1];
      if (!assertions[name](element, matches)) {
        match = false; break;
      }
    }

    return match;
  },
  toQueryParams: function(query, separator) {
    var query = query || window.location.search;
    var match = query.replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    var hash = {};
    var parts = match[1].split(separator || '&');
    for (var i=0; i < parts.length; i++) {
      var pair = parts[i].split('=');
      if (pair[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          var object = hash[key];
          var isArray = object != null && typeof object == "object" &&
            'splice' in object && 'join' in object
          if (!isArray) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
    };
    return hash;
  },
  
  String: {
    interpret: function(value) {
      return value == null ? '' : String(value);
    }
  }
};

JsUnitTest.gsub.prepareReplacement = function(replacement) {
  if (typeof replacement == "function") return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
};
