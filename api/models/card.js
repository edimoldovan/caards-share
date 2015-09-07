var joi = require("joi");
var BaseModel = require("hapi-mongo-models").BaseModel;
var ObjectAssign = require("object-assign");

var Card = BaseModel.extend({
  constructor: function (attrs) {
		ObjectAssign(this, attrs);
  }
});

Card._collection = "cards";

Card.schema = joi.object().keys({
  name: joi.string(),
  occupation: joi.string(),
  email: joi.string().email(),
  phone: joi.string(),
  createdAt: joi.date(),
  location: joi.array().items({
    latitude: joi.number(),
    longitude: joi.number()
  })
});

Card.indexes = [
  [{ "location": "2d" }],
  [{ "location": "2dsphere" }],
  [{ "createdAt": 1 }],
  [{ "expireAfterSeconds": 3600 }]
];

module.exports = Card;