DrNicTest.Event = {};
DrNicTest.Event.cache = { };
DrNicTest.Event.observe = function(element, eventName, handler) {
  var cache = DrNicTest.Event.cache;
  function getDOMEventName(eventName) {
    if (eventName && eventName.indexOf(':') > -1) return "dataavailable";
    return eventName;
  };
  
  function getEventID(element) {
    if (element._prototypeEventID) return element._prototypeEventID[0];
    arguments.callee.id = arguments.callee.id || 1;
    return element._prototypeEventID = [++arguments.callee.id];
  }

  function getDOMEventName(eventName) {
    if (eventName && eventName.indexOf(':') > -1) return "dataavailable";
    return eventName;
  }

  function getCacheForID(id) {
    return cache[id] = cache[id] || { };
  }

  function getWrappersForEventName(id, eventName) {
    var c = getCacheForID(id);
    return c[eventName] = c[eventName] || [];
  }

  function createWrapper(element, eventName, handler) {
    var id = getEventID(element);
    var c = getWrappersForEventName(id, eventName);
    var handlers = [];
    for (wrapper in c) {
      handlers.push(wrapper.handler);
    }
    if (handlers.indexOf(handler) > -1) return false;

    var wrapper = function(event) {
      if (!Event || !Event.extend ||
        (event.eventName && event.eventName != eventName))
          return false;

      Event.extend(event);
      handler.call(element, event);
    };

    wrapper.handler = handler;
    c.push(wrapper);
    return wrapper;
  }
  
  element = DrNicTest.$(element);
  var name = getDOMEventName(eventName);

  var wrapper = createWrapper(element, eventName, handler);
  if (!wrapper) return element;

  if (element.addEventListener) {
    element.addEventListener(name, wrapper, false);
  } else {
    element.attachEvent("on" + name, wrapper);
  }

  return element;
};
