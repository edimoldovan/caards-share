var config = require("config");
var privateKey = config.get("auth.privateKey");
var Hapi = require("hapi");
var Blipp = require("blipp");
var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    }
  }
});
var routes = require("./routes");
var hapiMongoModels = {
  register: require("hapi-mongo-models"),
  options: {
    mongodb: {
      url: "mongodb://localhost:27017/cards",
      settings: {}
    },
    autoIndex: false
  }
};

var accounts = {
  123: {
    id: 123,
    user: 'john',
    fullName: 'John Doe',
    scope: ['a', 'b']
  }
};

server.on("log", function (logData, tags) {
  if (tags.log) {
    console.log(logData);
  }
  if (tags.error) {
    console.log(logData);
  }
});

server.register(hapiMongoModels, function (err) {
  if (err) {
    console.log("Failed loading plugin");
  }
});

var validate = function (request, decodedToken, callback) {

  var error = null;
  var credentials = accounts[decodedToken.accountId] || {};

  if (!credentials) {
    return callback(error, false, credentials);
  }

  return callback(error, true, credentials)
};

server.connection({
  host: "0.0.0.0",
  port: 8000
});

server.register({register: require("hapi-auth-jwt")}, function (err) {
  server.auth.strategy("token", "jwt", {
    key: privateKey,
    validateFunc: validate
  });
  server.route(routes);
});

server.register(Blipp, function(err) {
  server.register([
    require("inert"),
    require("vision"),
    {
      register: require("hapi-swagger"),
      options: {
        documentationPath: "/api/documentation"
      }
    }], function (err) {
    server.start(function() {
      // Add any server.route() config here
      console.log('Server running at:', server.info.uri);
    });
  });
});