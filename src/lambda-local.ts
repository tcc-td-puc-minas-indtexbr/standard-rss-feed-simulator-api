import Server from './server'
import {APIGatewayProxyEvent, Context} from "aws-lambda"

const event: APIGatewayProxyEvent = null
const context: Context = null

// Server.lambdaDeprecated(event, context)

Server.lambda(event, context)

Server.lambda3()
