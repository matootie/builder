/**
 * App AWS CDK stack tests.
 */

// Standard library imports.
import { promises as fs } from "fs"
import path from "path"

// External imports.
import { App } from "aws-cdk-lib"
import { Template } from "aws-cdk-lib/assertions"

// Local library imports.
import { ApiStack } from "@lib/api.stack"

// The path for the dummy zip file created for testing purposes.
const DUMMY_ZIP = "out/function.test.zip"

describe("When using the AWS CDK...", () => {
  // Generate a dummy zip file used to satisfy AWS Lambda function creation
  // requirements.
  beforeAll(async () => {
    await fs.mkdir(path.dirname(DUMMY_ZIP), {
      recursive: true,
    })
    const x = await fs.open(DUMMY_ZIP, "w")
    await x.close()
  })
  // Clean up the dummy zip file created for testing purposes.
  afterAll(async () => {
    await fs.unlink(DUMMY_ZIP)
  })
  // Test the creation of the AWS Lambda function.
  test("...it will create an AWS Lambda function.", () => {
    expect(true).toBeTruthy()
    const app = new App()
    const stack = new ApiStack(app, "MyTestStack", {
      codeZipLocation: DUMMY_ZIP,
    })
    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs14.x",
    })
  })
})
