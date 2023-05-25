const { DynamoDB, Lambda} = require('aws-sdk')

exports.handler = async function(e) {

    //AWS SDK clients, DynamoDB & Lambda
    const dynamo = new DynamoDB()
    const lambda = new Lambda()

    await dynamo.updateItem({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { path: { S: e.path } },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: { ':incr': { N: '1' } }
    }).promise()

    const res = await lambda.invoke({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: JSON.stringify(e)
    }).promise()

    console.info('downstream response: ', JSON.stringify(res,undefined,2))

    return JSON.parse(res.Payload)
}