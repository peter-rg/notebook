const {test, describe} = require('node:test')
const assert = require('node:assert')
const average = require('../utils/for_testing').average

describe('average of', () => {
  test('one value is the value itself', () => {
    assert.strictEqual(average([5]),5)
  })

  test('many values is calculated right', () => {
    assert.strictEqual(average([3,4,5,10]), 5.5)
  })

  test('an empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})

