export default componentName =>
  (descendantName, modifierName) =>
    `${componentName}` +
    (descendantName ? `__${descendantName}` : ``) +
    (modifierName ? `--${modifierName}` : ``);
