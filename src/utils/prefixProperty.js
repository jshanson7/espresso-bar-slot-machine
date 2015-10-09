import { memoize, capitalize, find, isString, kebabCase, some } from 'lodash';

export default (property, kebab) => {
  return kebab ?
    kebabProp(prefixProp(property)) :
    prefixProp(property);
};

const style = document.body.style;
const prefixes = ['Webkit', 'Moz', 'ms', 'O'];
const prefixProp = memoize(property => {
  if (isString(style[property])) { return property; }

  let currentPrefixedProp;
  const capitalized = capitalize(property);
  return find(prefixes, prefix =>
      isString(style[currentPrefixedProp = prefix + capitalized])) ?
    currentPrefixedProp :
    property;
});

function kebabProp(property) {
  const isPrefixed = some(prefixes, prefix => startsWith(property, prefix));
  return `${isPrefixed ? '-' : ''}${kebabCase(property)}`;
}

function startsWith(str, subStr) {
  return str.lastIndexOf(subStr, 0) === 0;
}
