import _ from 'underscore';
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
  const adaptable = ADAPTABLE_METHODS.reduce((curr, prev) => {
    prev[curr] = {};
    return prev;
  }, {});
  const noStorage = sut.bind(sut, {});
  const arrayStorage = sut.bind(sut, {storage: DEFAULTS});
  const invalidStorage = sut.bind(sut, {storage: 'foo'});
  const adaptableStorage = sut.bind(sut, {storage: adaptable});

  assert.doesNotThrow(arrayStorage, 'should support array storage');
  assert.doesNotThrow(adaptableStorage, 'should support adaptable storage');

  assert.throws(noStorage, /`options.storage ` is missing/i,
    'should have a storage');
  assert.throws(invalidStorage,
    /`options.storage` should be a queryable or an array/i,
    'should have a valid storage');
  assert.end();
});

test('adapter#find', (sub) => {
  sub.test('exists', (assert) => {
    const sut = createAdapter(DEFAULTS);

    assert.ok(sut.find, 'should exist');
    assert.end();
  });

  sub.test('returns an array', (assert) => {
    const sut = createAdapter(DEFAULTS);
    const result = sut.find();

    assert.ok(_.isArray(result), 'should return an array');
    assert.end();
  });
});

test('adapter find throws if no storage is passed', (assert) => {
  assert.throws(createAdapter, /storage is missing/i, 'storage is missing');
  assert.end();
});

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
