const client = require('../redis')
async function incrOrCut (key, deltascore, member) {
  if (typeof deltascore !== 'number') return
  let score = await client.zscore(key, member)
  score = score ? Number(score) : 0
  let r = score + deltascore < 0 ? 0 : score + deltascore
  await client.zadd(key, r, member)
}

module.exports = {
  incrOrCut
}
