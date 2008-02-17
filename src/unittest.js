<%= include 'HEADER' %>

var UnitTest = {
  Version: '<%= APP_VERSION %>',
};

<%= include 'common.js' %>

<%= include 'logger.js', 'message_template.js' %>
<%= include 'assertions.js' %>
<%= include 'runner.js', 'test_case.js' %>
