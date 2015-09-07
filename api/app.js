var Hapi = require("hapi");
var Blipp = require("blipp");
var server = new Hapi.Server();
var card = require("./models/card");
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

server.register(hapiMongoModels, function (err) {
  if (err) {
    console.log("Failed loading plugin");
  }
});

server.connection({ 
  host: "0.0.0.0",
  port: 3003 
});

server.route({
  method: "GET",
  path:"/api/cards",
  handler: function (request, reply) {
    
    console.log("GET");
    
    card.find({
        "location" : {
          "$nearSphere": {
            "$geometry": {
              "type": "Point", "coordinates": [parseFloat(request.url.query.longitude), parseFloat(request.url.query.latitude)]
            },
            "maxDistance": 0.002,
            "$uniqueDocs": 1
          }
        }
      }, {}, function(error, results) {
      if (error) {
        console.log(error);
        return reply(error);
      }
      return reply(results);
    });
  }
});

/*server.route({
  method: "GET",
  path:"/api/locations/{id}",
  handler: function (request, reply) {
    var id = request.params.id ? encodeURIComponent(request.params.id) : null;

    model.findById(id, function(err, result) {
      if (err) {
        reply(err);
      }
      reply(result);
    });
  }
});*/

server.route({
  method: "POST",
  path:"/api/cards",
  handler: function (request, reply) {

    console.log("POST");

    card.find({
      name: request.payload.card.name,
      occupation: request.payload.card.occupation,
      company: request.payload.card.company,
      email: request.payload.card.email,
      phone: request.payload.card.phone
    }, {}, function(error, results) {
      if (error) {
        console.log(error);
        return reply(error);
      }
      if (results && results.length === 0) {
        var newCard = {
          name: request.payload.card.name,
          occupation: request.payload.card.occupation,
          company: request.payload.card.company,
          email: request.payload.card.email,
          phone: request.payload.card.phone,
          createdAt: new Date(),
          location: [
            request.payload.location.latitude,
            request.payload.location.longitude
          ]
        };

        card.insertOne(newCard, function(error, results) {
          if (error) {
            console.log(error);
            return reply(error);
          }
          card.ensureIndexes(function(error) {
            if (error) {
              console.log(error);
            }
            if (results && results.length > 0) {
              return reply(results[0]);
            } else {
              return reply([]);
            }
          });
        });
      } else {
        card.findByIdAndUpdate(results[0]._id, {
          $set: {
            createdAt: new Date(),
            location: [
              request.payload.location.latitude,
              request.payload.location.longitude
            ]
          }
        }, {}, function(error, updatedCard) {
          if (error) {
            console.log(error);
            reply(error);
          }
          return reply(updatedCard);
        });
      }
    });
  }
});

/*server.route({
  method: "PUT",
  path:"/api/cards/{id}",
  handler: function (request, reply) {
  	var id = request.params.id ? encodeURIComponent(request.params.id) : null;

    console.log("PUT");

    card.findByIdAndUpdate(id, {
  		name: request.payload.name,
			occupation: request.payload.occupation,
			email: request.payload.email,
			phone: request.payload.phone,
			latitude: request.payload.latitude,
			longitude: request.payload.longitude
  	}, function(error, results) {
      if (error) {
        reply(error);
      }
      reply(results[0]);
    });
  }
});*/

server.register(Blipp, function(err) {
  server.start(function () {
	  console.log("Server running at:", server.info.uri);
	});
});