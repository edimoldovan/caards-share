var cardsRoute = require("./cards");
var sessionsRoute = require("./sessions");
var staticRoute = require("./static");

module.exports = [].concat(
  cardsRoute,
  sessionsRoute,
  staticRoute
);