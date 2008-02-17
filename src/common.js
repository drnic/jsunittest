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
  }
};
