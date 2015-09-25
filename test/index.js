import _ from 'underscore';
import test from 'blue-tape';

import createAdapter from '../src';

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
