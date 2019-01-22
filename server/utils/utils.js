const client = require('../redis')
async function incrOrCut (key, deltascore, member) {
  if (typeof deltascore !== 'number') return
  let score = await client.zscore(key, member)
  score = score ? Number(score) : 0
  let r = score + deltascore < 0 ? 0 : score + deltascore
  await client.zadd(key, r, member)
}

function ArrayMinus (arr1, arr2) {
  for (let i = arr1.length - 1; i >= 0; i--) {
    let a = arr1[i]
    for (let j = arr2.length - 1; j >= 0; j--) {
      let b = arr2[j]
      if (a === b) {
        arr1.splice(i, 1)
        arr2.splice(j, 1)
        break
      }
    }
  }
  return arr1
}

module.exports = {
  incrOrCut,
  ArrayMinus
}
