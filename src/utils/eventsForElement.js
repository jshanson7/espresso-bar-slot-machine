import { findWhere, invoke, without } from 'lodash';

const eventsForElements = [];

// ensures only one DOM event listener per event per element
export default element => {
  const existing = findWhere(eventsForElements, { element });
  if (existing) { return existing.events; }
  const events = createEventsForElement(element);
  eventsForElements.push({ events, element });
  return events;
};

function createEventsForElement(element) {
  const callbacksForEvents = {};
  return { on, off };

  function on(eventName, callback) {
    const existing = callbacksForEvents[eventName];
    if (existing) { return existing.callbacks.push(callback); }
    const invoker = (...args) =>
      invoke(callbacksForEvents[eventName].callbacks, 'apply', null, args);

    callbacksForEvents[eventName] = { invoker, callbacks: [callback] };
    return element.addEventListener(eventName, invoker);
  }

  function off(eventName, callback) {
    const existing = callbacksForEvents[eventName];
    existing.callbacks = without(existing.callbacks, callback);
    if (existing.callbacks.length === 0) {
      element.removeEventListener(eventName, existing.invoker);
      delete callbacksForEvents[eventName];
    }
  }
}
