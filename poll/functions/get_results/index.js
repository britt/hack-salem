const doc = require('dynamodb-doc')
const dynamo = new doc.DynamoDB()

exports.handle = function (e, ctx, cb) {
  dynamo.scan({
    'TableName': 'votes'
  }, function (err, data) {
    if (err) {
      console.log(`error retrieving votes: ${err}`)
      cb(null, { error: `error retrieving votes: ${err}` })
    } else {
      let votes = {}
      console.log(data)
      data.Items.forEach(d => { votes[d.vote] ? votes[d.vote] = votes[d.vote] + 1 : votes[d.vote] = 1 })
      cb(null, { results: votes })
    }
  })
}
