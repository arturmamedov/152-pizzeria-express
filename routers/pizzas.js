const express = require("express");
const router = express.Router();
let pizzas = require("../data/pizzas");

// # Index
router.get("/", (req, res) => {
  const responseData = {
    result: pizzas,
    message: `Lista della pizze`,
    success: true,
  };

  res.json(responseData);
});

// # Show
router.get("/:id", (req, res) => {
  const pizzaId = parseInt(req.params.id);
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  if (!pizza) {
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    return res.status(404).json(responseData);
  }

  const responseData = {
    result: pizza,
    message: `Dettaglio della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
});

// # Store
router.post("/", (req, res) => {
  const responseData = {
    message: `Crezione di una pizza`,
    success: true,
  };

  res.json(responseData);
});

// # Update
router.put("/:id", (req, res) => {
  const pizzaId = req.params.id;

  const responseData = {
    message: `Modifica intera della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
});

// # Modify
router.patch("/:id", (req, res) => {
  const pizzaId = req.params.id;

  const responseData = {
    message: `Modifica parziale della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
});

// # Destroy
router.delete("/:id", (req, res) => {
  const pizzaId = parseInt(req.params.id);
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  if (!pizza) {
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    return res.status(404).json(responseData);
  }

  pizzas = pizzas.filter((pizza) => pizza.id !== pizzaId);

  const responseData = {
    result: pizza,
    message: `Eliminazione della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
});

module.exports = router;
