const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    success: true,
    result: { description: "Following: you can find all doc links", pages: "/docs/pages", version: "v1" },
  });
});

router.get("/pages", function (req, res) {
  res.json({
    success: true,
    result: [
      {
        url: "/",
        description: "app healthcheck",
      },
      {
        url: "/menu",
        description: "list of all pizzas",
      },
      {
        url: "/docs",
        description: "doc root",
      },
      {
        url: "/docs/pages",
        description: "all pages docs",
      },
    ],
  });
});

router.get("/welcome", (req, res) => {
  res.json({
    message: "Benvenuto alla Pizzeria Express",
  });
});

module.exports = router;
