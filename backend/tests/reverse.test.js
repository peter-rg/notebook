const reverse = require('../utils/for_testing').reverse
const { test, describe } = require('node:test')
const assert = require('node:assert')
describe('reverse of', () => {
  test('ad', () => {
    const result = reverse('ab')

    assert.strictEqual(result, 'ba')
  })

  test('peter', () => {
    const result = reverse('peter')
    assert.strictEqual(result, 'retep')
  })

  test('1234', () => {
    const result = reverse('1234')
    assert.strictEqual(result, '4321')
  })
})
