const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})

exports.handle = function (e, ctx, cb) {
  console.log('received event', e, e.vote)
  dynamo.put({
    'TableName': 'votes',
    'Item': {
      'id': e.id,
      'vote': e.vote
    }
  }, function (err, data) {
    if (err) {
      console.log(`error recording vote: ${err}`)
      cb(null, { error: `error recording vote: ${err}` })
    } else {
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
  })
}
