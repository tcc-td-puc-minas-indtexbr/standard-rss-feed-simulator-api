import {
  APIGatewayProxyEvent,
  Context
} from 'aws-lambda'
import Server from './server'

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  Server.lambda(event, context)
}
