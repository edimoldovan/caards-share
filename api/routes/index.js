var cardsRoute = require("./cards");
var staticRoute = require("./static");

module.exports = [].concat(
  cardsRoute,
  staticRoute
);