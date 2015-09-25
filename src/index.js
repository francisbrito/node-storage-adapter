/**
 * External imports
 */
import _ from 'underscore';
import mingo from 'mingo';
import libdebug from 'debug';

// create debug logger
const debug = libdebug('storage-adapter');

export const ADAPTABLE_METHODS = [
  'skip',
  'sort',
  'find',
  'limit',
  'insert',
  'update',
  'remove',
  'aggregate',
];

function isAdaptable(storage) {
  return typeof storage === 'object'
  && _.every(ADAPTABLE_METHODS, (method) => method in storage);
}

const PROTOTYPE = {
  find(query, projection) {
    debug('received query %j', query);
    debug('received projection %j', projection);

    return mingo.find(this.storage, query, projection).all();
  },
};

export default function createAdapter(options = {}) {
  debug('passed-in options (keys only): %j', Object.keys(options));
  debug('passed-in storage (type): %j', typeof options.storage);

  if (!options.storage) throw new Error('`options.storage` is missing.');
  if (!(_.isArray(options.storage) || isAdaptable(options.storage))) {
    throw new Error('`options.storage` should be an adaptable or an array.');
  }

  return Object.create(PROTOTYPE, {
    storage: {
      value: options.storage,
    },
  });
}
