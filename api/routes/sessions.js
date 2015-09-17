var joi = require("joi");
var controller = require("../controllers/sessions");

module.exports = [
  {
    method: "POST",
    path: "/api/sessions",
    config: {
      description: "Logs user in",
      notes: "Logs user in based on provided credentials and returns user and token",
      tags: ["api"],
      validate: {
        payload: {
          session: {
            email: joi.string().required().description("User email/name"),
            password: joi.string().required().description("Password")
          }
        }
      }
    },
    handler: controller.login.bind(controller)
  }
];






