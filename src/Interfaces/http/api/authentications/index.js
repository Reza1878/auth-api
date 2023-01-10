const AuthenticationHandlers = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationHandlers(container);

    server.route(routes(authenticationsHandler));
  },
};
