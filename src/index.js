/**
 * External imports
 */
import mingo from 'mingo';
import libdebug from 'debug';

// create debug logger
const debug = libdebug('storage-adapter');

const PROTOTYPE = {
  find(query, projection) {
    return mingo.find(this.storage, query, projection).all();
  },
};

export default function createAdapter(options = {}) {
  debug('passed-in options (keys only): %j', Object.keys(options));

  if (!options.storage) throw new Error('Storage is missing.');

  return Object.create(PROTOTYPE, {
    storage: {
      value: options.storage,
    },
  });
}
