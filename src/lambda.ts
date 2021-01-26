import {
  APIGatewayProxyEvent,
  Context
} from 'aws-lambda'
import Server from './server'

export const lambda = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  return Server.lambda(event, context)
}
