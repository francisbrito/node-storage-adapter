import _ from 'underscore';
import co from 'co';
import test from 'blue-tape';

import createAdapter from '../src';
import {ADAPTABLE_METHODS} from '../src';

const DEFAULTS = {
  storage: [
    {key: 'x', value: 1},
    {key: 'x', value: 2},
    {key: 'x', value: 3},
    {key: 'y', value: 4},
    {key: 'z', value: 5},
    {key: 'w', value: -1},
  ],
};

test('adapter factory rejects invalid storages', (assert) => {
  const sut = createAdapter;
  const adaptable = ADAPTABLE_METHODS.reduce((prev, curr) => {
    prev[curr] = {};
    return prev;
  }, {});
  const noStorage = sut.bind(sut, {});
  const arrayStorage = sut.bind(sut, DEFAULTS);
  const invalidStorage = sut.bind(sut, {storage: 'foo'});
  const adaptableStorage = sut.bind(sut, {storage: adaptable});

  assert.doesNotThrow(arrayStorage, 'should support array storage');
  assert.doesNotThrow(adaptableStorage, 'should support adaptable storage');

  assert.throws(noStorage, /`options.storage` is missing/i,
    'should have a storage');
  assert.throws(invalidStorage,
    /`options.storage` should be an adaptable or an array/i,
    'should have a valid storage');
  assert.end();
});

test('adapter find returns a promise resolving to a array',
co.wrap((assert) => {
  const sut = createAdapter(DEFAULTS);
  const result = sut.find();

  // assert is promise
  assert.ok(result.then, 'result should be thenable');
  assert.ok(result.catch, 'result should be catchable');

  result.then((docs) => {
    assert.ok(docs, 'result should resolvable');
    assert.ok(_.isArray(docs), 'result should resolve to an array');
  });
}));

test('adapter find supports querying', (assert) => {
  const sut = createAdapter(DEFAULTS);
  const query = {
    key: 'x',
  };
  const result = sut.find(query);

  assert.ok(_.every(result, (r) => r.key === 'x'), 'result should match query');
  assert.end();
});

test('adapter find supports projection', (assert) => {
  const sut = createAdapter(DEFAULTS);
  const projection = {
    key: false,
    value: true,
  };
  const result = sut.find({}, projection);

  assert.ok(_.every(result, (r) => 'value' in r && !('key' in r)),
  'should contain selected keys only');
  assert.end();
});
