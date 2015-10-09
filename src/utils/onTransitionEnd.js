import prefixProperty from './prefixProperty';
import eventsForElement from './eventsForElement';

const eventFailureGracePeriod = 400;
const { on, off } = eventsForElement(window);
const transitionEndEvent = {
  transition: 'transitionend',
  OTransition: 'otransitionend',
  MozTransition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd'
}[prefixProperty('transition')];

export default (element, expectedDuration, callback) =>
  new Promise(resolve => {
    let done = false;
    let forceEnd = false;

    on(transitionEndEvent, onTransitionEnd);

    setTimeout(() => {
      if (!done) {
        // forcing onTransitionEnd callback...
        forceEnd = true;
        onTransitionEnd();
      }
    }, expectedDuration + eventFailureGracePeriod);

    function onTransitionEnd(e) {
      if (forceEnd || e.target === element) {
        done = true;
        off(transitionEndEvent, onTransitionEnd);
        resolve(e);
        if (callback) { callback(e); }
      }
    }
  });
