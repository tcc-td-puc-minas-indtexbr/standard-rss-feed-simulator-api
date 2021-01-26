"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }



var _server = require('./server'); var _server2 = _interopRequireDefault(_server);

 const handler = async (
  event,
  context
) => {
  return _server2.default.lambda(event, context)
}; exports.handler = handler
