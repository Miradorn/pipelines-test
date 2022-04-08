import { Stack, StackProps, pipelines } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PipelineTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('miradorn/pipelines-test', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'PipelineTestQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
