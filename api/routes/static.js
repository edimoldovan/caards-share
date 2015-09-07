var controller = require("../controllers/static");
var config = require("config");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: controller.index.bind(controller)
  },
  {
    method: "GET",
    path: "/" + config.get("admin.url"),
    handler: controller.admin.bind(controller)
  },
  {
    method: "GET",
    path: "/assets/{name}.css",
    handler: controller.adminCss.bind(controller)
  },
  {
    method: "GET",
    path: "/assets/{name}.js",
    handler: controller.adminJs.bind(controller)
  },
  {
    method: "GET",
    path: "/final",
    handler: controller.final.bind(controller)
  },
  {
    method: "GET",
    path: "/static/images/{name}.png",
    handler: controller.png.bind(controller)
  },
  {
    method: "GET",
    path: "/profile/{name}.png",
    handler: controller.profile.bind(controller)
  },
  {
    method: "GET",
    path: "/static/fonts/{name}.otf",
    handler: controller.otf.bind(controller)
  }
];






