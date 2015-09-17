"use strict";

var jwt = require("jsonwebtoken");
var config = require("config");
var controller = {};

module.exports = (function() {
  return controller;
}());

controller.login = function(request, reply) {
  var ota = request.params.ota;
  var privateKey = config.get("auth.privateKey");

  return reply({token: jwt.sign({ accountId: 123 }, privateKey)});
}