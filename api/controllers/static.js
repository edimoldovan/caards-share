var controller = {};

module.exports = (function() {
  "use strict";
  return controller;
}());

controller.index = function(request, reply) {
  reply.file(__dirname + "/../static/index.html");
};

controller.admin = function(request, reply) {
  reply.file(__dirname + "/../static/admin/index.html");
};

controller.adminCss = function(request, reply) {
  reply.file(__dirname + "/../static/admin/assets/" + request.params.name + ".css");
};

controller.adminJs = function(request, reply) {
  reply.file(__dirname + "/../static/admin/assets/" + request.params.name + ".js");
};

controller.final = function (request, reply) {
  reply.file(__dirname + "/../static/final.html");
};

controller.png = function (request, reply) {
  reply.file(__dirname + "/../static/images/" + request.params.name + ".png");
};

controller.profile = function (request, reply) {
  reply.file(__dirname + "/../static/profile/" + request.params.name + ".png");
};

controller.otf = function (request, reply) {
  reply.file(__dirname + "/../static/fonts/" + request.params.name + ".otf");
};