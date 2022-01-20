#!/usr/bin/env node
import { App } from "aws-cdk-lib"
import { ApiStack } from "@lib/api.stack"

// Create the stack.
const app = new App()
new ApiStack(app, "DiscordBuilderStack", {})
