const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const result = array.reduce((sum, currentValue) => sum+currentValue, 0)
  return array.length === 0 ? 0:  result / array.length
}

module.exports = { reverse, average }
