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

var swaggerOptions = {
  authorizations: {
    type: "apiKey",
    authorizations: "header",
    keyname: "Authorization"
  },
  documentationPath: "/api/documentation"
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

server.connection({
  host: "0.0.0.0",
  port: 8000
});

server.route(routes);

server.register(Blipp, function(err) {
  server.register([
    require("inert"),
    require("vision"),
    {
      register: require("hapi-swagger"),
      options: swaggerOptions
    }], function (err) {
    server.start(function() {
      // Add any server.route() config here
      console.log('Server running at:', server.info.uri);
    });
  });
});