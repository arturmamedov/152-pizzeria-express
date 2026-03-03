let pizzasData = require("../data/pizzas");

function index(req, res) {
  let pizzas = [...pizzasData];

  const searchFilter = req.query.search;

  if (searchFilter) {
    pizzas = pizzas.filter((pizza) => {
      const normalizedName = pizza.name.toLowerCase().trim();
      const normalizedFilter = searchFilter.toLowerCase().trim();

      if (normalizedName.includes(normalizedFilter)) return true;

      for (const ing of pizza.ingredients) {
        const normalizedIngredient = ing.toLowerCase().trim();
        if (normalizedIngredient.includes(normalizedFilter)) return true;
      }

      return false;
    });
  }

  const responseData = {
    result: pizzas.map(buildPizzaObject),
    message: `Lista della pizze`,
    success: true,
  };

  res.json(responseData);
}

function show(req, res) {
  const pizzas = [...pizzasData];
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
    result: buildPizzaObject(pizza),
    message: `Dettaglio della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
}

function store(req, res) {
  const responseData = {
    message: `Crezione di una pizza`,
    success: true,
  };

  res.json(responseData);
}

function update(req, res) {
  const pizzaId = req.params.id;

  const responseData = {
    message: `Modifica intera della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
}

function modify(req, res) {
  const pizzaId = req.params.id;

  const responseData = {
    message: `Modifica parziale della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
}

function destroy(req, res) {
  const pizzas = [...pizzasData];
  const pizzaId = parseInt(req.params.id);
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  if (!pizza) {
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    return res.status(404).json(responseData);
  }

  pizzasData = pizzas.filter((pizza) => pizza.id !== pizzaId);

  const responseData = {
    result: buildPizzaObject(pizza),
    message: `Eliminazione della pizza ${pizzaId}`,
    success: true,
  };

  res.json(responseData);
}

const buildPizzaObject = (pizza) => {
  const imageAbsolutePath = "http://localhost:3000/" + pizza.image;
  return {
    ...pizza,
    image: imageAbsolutePath,
  };
};

module.exports = { index, show, store, update, modify, destroy };
