import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';

export class PingerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pingUrl = process.env.PING_URL;
    if (!pingUrl) {
      throw new Error("PING_URL environment variable not defined! Is .env missing?");
    }

    const pinger = new lambda.Function(this, 'Pinger', {
      functionName: 'Pingeroni',
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: 'bootstrap', //  Always 'bootstrap' for Rust Lambdas
      code: lambda.Code.fromAsset(path.join(__dirname, '../../rust/pinger/target/lambda/pinger')),
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
      environment: {
        RUST_BACKTRACE: '1',
        PING_URL: pingUrl,
      },
    });

    // Run the Lambda once per day at midnight UTC
    const scheduleRule = new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.cron({ 
        minute: '0', 
        hour: '0' 
      }),
      description: 'Daily schedule for running website ping Lambda',
    });
    scheduleRule.addTarget(new targets.LambdaFunction(pinger));
  }
}
