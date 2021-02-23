import {
  APIGatewayProxyEvent,
  Context
} from 'aws-lambda'
import Server from './server'

/*
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  return Server.lambda(event, context)
}
*/
export const handler = Server.lambda
