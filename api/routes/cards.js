var joi = require("joi");
var controller = require("../controllers/cards");

module.exports = [
  {
    method: "GET",
    path: "/api/cards",
    config: {
      auth: "token",
      description: "Retrieve shared cards",
      notes: "blah blah",
      tags: ["api"],
    },
    handler: controller.getAll.bind(controller)
  },
  {
    method: "POST",
    path: "/api/cards",
    config: {
      auth: "token",
      description: "Share card",
      notes: "blah blah",
      tags: ["api"],
      validate: {
        payload: {
          card: {
            name: joi.string().required().description("Some desc"),
            occupation: joi.string().required().description("Some desc"),
            company: joi.string().required().description("Some desc"),
            email: joi.string().required().description("Some desc"),
            phone: joi.string().description("Some desc"),
          }
        }
      }
    },
    handler: controller.share.bind(controller)
  }
];