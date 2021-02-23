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
export const handler3 = Server.lambda3
