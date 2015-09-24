import _ from 'underscore';
import test from 'blue-tape';

import createAdapter from '../src';

function setUp() {
  return createAdapter({
    storage: [
      {key: 'x', value: 1},
      {key: 'x', value: 2},
      {key: 'x', value: 3},
      {key: 'y', value: 4},
      {key: 'z', value: 5},
      {key: 'w', value: -1},
    ],
  });
}

test('adapter#find', (sub) => {
  sub.test('exists', (assert) => {
    const sut = setUp();

    assert.ok(sut.find, 'should exist');
    assert.end();
  });

  sub.test('returns an array', (assert) => {
    const sut = setUp();
    const result = sut.find();

    assert.ok(_.isArray(result), 'should return an array');
    assert.end();
  });
});
