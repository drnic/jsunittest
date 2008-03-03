JsUnitTest.Event = {};
// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini
// namespaced by Dr Nic Williams 2008

// http://dean.edwards.name/weblog/2005/10/add-event/
// http://dean.edwards.name/weblog/2005/10/add-event2/
JsUnitTest.Event.addEvent = function(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		// assign each event handler a unique ID
		if (!handler.$$guid) handler.$$guid = JsUnitTest.Event.addEvent.guid++;
		// create a hash table of event types for the element
		if (!element.events) element.events = {};
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		// assign a global event handler to do all the work
		element["on" + type] = this.handleEvent;
	}
};
// a counter used to create unique IDs
JsUnitTest.Event.addEvent.guid = 1;

JsUnitTest.Event.removeEvent = function(element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else {
		// delete the event handler from the hash table
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
};

JsUnitTest.Event.handleEvent = function(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || JsUnitTest.Event.fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};

JsUnitTest.Event.fixEvent = function(event) {
	// add W3C standard event methods
	event.preventDefault = this.fixEvent.preventDefault;
	event.stopPropagation = this.fixEvent.stopPropagation;
	return event;
};
JsUnitTest.Event.fixEvent.preventDefault = function() {
	this.returnValue = false;
};
JsUnitTest.Event.fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};
