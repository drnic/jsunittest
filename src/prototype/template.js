DrNicTest.Template = function(template, pattern) {
  this.template = template; //template.toString();
  this.pattern = pattern || DrNicTest.Template.Pattern;
};

DrNicTest.Template.prototype.evaluate = function(object) {
  if (typeof object.toTemplateReplacements == "function")
    object = object.toTemplateReplacements();

  return DrNicTest.gsub(this.template, this.pattern, function(match) {
    if (object == null) return '';

    var before = match[1] || '';
    if (before == '\\') return match[2];

    var ctx = object, expr = match[3];
    var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
    match = pattern.exec(expr);
    if (match == null) return before;

    while (match != null) {
      var comp = (match[1].indexOf('[]') === 0) ? match[2].gsub('\\\\]', ']') : match[1];
      ctx = ctx[comp];
      if (null == ctx || '' == match[3]) break;
      expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
      match = pattern.exec(expr);
    }

    return before + DrNicTest.String.interpret(ctx);
  });
}

DrNicTest.Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
