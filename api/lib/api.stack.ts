/**
 * App AWS CDK stack.
 */

// External imports.
import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda"
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"

/**
 * The App stack.
 */
interface AppStackProps extends StackProps {
  codeZipLocation?: string
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: AppStackProps) {
    super(scope, id, props)

    // The Redis connection secrets.
    const redisSecrets = Secret.fromSecretNameV2(
      this,
      "RedisSecret",
      "Builder/Redis",
    )

    // The configuration secrets.
    const configSecrets = Secret.fromSecretNameV2(
      this,
      "ConfigSecrets",
      "Builder/Config",
    )

    // The AWS Lambda function.
    const handler = new Function(this, "Function", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(props?.codeZipLocation ?? "out/function.zip"),
      handler: "handler.handler",
      environment: {
        REDIS_URL: redisSecrets.secretValueFromJson("redisUrl").toString(),
        AUTH0_CLIENT_ID: configSecrets
          .secretValueFromJson("auth0ClientId")
          .toString(),
        AUTH0_CLIENT_SECRET: configSecrets
          .secretValueFromJson("auth0ClientSecret")
          .toString(),
        DISCORD_CLIENT_ID: configSecrets
          .secretValueFromJson("discordClientId")
          .toString(),
        DISCORD_CLIENT_SECRET: configSecrets
          .secretValueFromJson("discordClientSecret")
          .toString(),
      },
    })

    // The AWS API Gateway for the function.
    new LambdaRestApi(this, "Endpoint", {
      handler,
    })
  }
}
