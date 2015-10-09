import { delay, noop } from 'lodash';

export default (duration, callback) =>
  new Promise(resolve =>
    delay(() => (callback || noop)(resolve()), duration)
  );
