const server = require('./server');
const config = require('./config/default');

server.listen(config.port);

