import { Stage, StageProps, Stack, StackProps, pipelines, aws_lambda as lambda, aws_s3_deployment as s3deploy } from 'aws-cdk-lib';
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
    pipeline.addStage(new MyPipelineAppStage(this, "Dev", {env: props?.env}))
    pipeline.addStage(new MyPipelineAppStage(this, "Prod", {env: props?.env}))
  }
}


  export class MyPipelineAppStage extends Stage {
    
    constructor(scope: Construct, id: string, props?: StageProps) {
      super(scope, id, props);
  
      const lambdaStack = new MyLambdaStack(this, 'LambdaStack');      
    }
}
  export class MyLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
  
      new lambda.Function(this, 'LambdaFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: new lambda.InlineCode('exports.handler = _ => "Hello, CDK";')
      });
    }
}
