const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

router.get("/", pizzaController.index);
router.get("/:id", pizzaController.show);
router.post("/", pizzaController.store);
router.put("/:id", pizzaController.update);
router.patch("/:id", pizzaController.modify);
router.delete("/:id", pizzaController.destroy);

module.exports = router;
