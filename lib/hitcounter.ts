import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export interface HitCounterProps {
    downstream: lambda.IFunction
}

export class HitCounter extends Construct {

    public readonly handler: lambda.Function

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id)


        const table = new dynamodb.Table(this, 'Hits', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING}
        })

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hitcounter.handler',
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName
            }
        })

        //Grant the Lambda role to read/write to DynamoDB table
        table.grantReadWriteData(this.handler)
        //Grant the Lambda role to invoke downtream func
        props.downstream.grantInvoke(this.handler)
    }

}