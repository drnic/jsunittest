<%= include 'HEADER' %>

var JsUnitTest = {
  Version: '<%= APP_VERSION %>',
};

<%= include 'prototype/class.js' %>

<%= include 'common.js' %>

<%= include 'logger.js', 'message_template.js' %>
<%= include 'assertions.js' %>
<%= include 'runner.js', 'test_case.js' %>
