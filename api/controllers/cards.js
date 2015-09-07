//var jwt = require("jsonwebtoken"); // in case you need jwt
var fs = require("fs");
// var config = require("config"); for config
var card = require("../models/card");
var controller = {};

module.exports = (function() {
  "use strict";
  return controller;
}());

controller.getAll = function(request, reply) {
  // for getting data out of a jwt
  /*var accessToken = request.headers.authorization.replace("Bearer ", "");
  var privateKey = config.get("auth.privateKey");
  var verified = jwt.verify(accessToken, privateKey);*/

  // this will use the server.on("log") in the app.js so one can implement nice logging set up in one place
  request.server.log(["log"], request);

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

};

controller.share = function(request, reply) {
  request.server.log(["log"], request);

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
};