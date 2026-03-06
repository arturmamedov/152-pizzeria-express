const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");
const validatePizza = require("../middlewares/validatePizza");
const sleeptimeMiddleware = require("../middlewares/sleeptime");
const pizzaUpload = require("../middlewares/pizzaUpload");

router.use(sleeptimeMiddleware);

router.get("/", pizzaController.index);
router.get("/:id", validatePizza.exists, pizzaController.show);
router.post("/", pizzaUpload.single("image"), validatePizza.payload, pizzaController.store);
router.put("/:id", pizzaUpload.single("image"), validatePizza.exists, validatePizza.payload, pizzaController.update);
router.patch("/:id", pizzaUpload.single("image"), validatePizza.exists, validatePizza.payload, pizzaController.modify);
router.delete("/:id", validatePizza.exists, pizzaController.destroy);

module.exports = router;
