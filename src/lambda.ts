import {
  APIGatewayProxyEvent,
  Context
} from 'aws-lambda'
import Server from './server'

export const handler = (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  return Server.lambda(event, context)
}
export const handler2 = Server.lambda3
export const handler3 = (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  return Server.lambdaDeprecated(event, context)
}
