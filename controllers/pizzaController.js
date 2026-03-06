// * Importo il finto database sotto forma di array di oggetti "pizza"
const fs = require("fs");
let pizzasData = require("../data/pizzas");

/**
 * Funzione che risponde alla richiesta ricevuta con
 * la lista delle pizze presenti in database
 *
 * @param {*} req
 * @param {*} res
 */
function index(req, res) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  let pizzas = [...pizzasData];

  // * recupero il query param facoltativo "search" dall'url
  const searchFilter = req.query.search;

  // * se è stato settato dall'utente devo filtrare le pizze
  // * prima di darle in output
  if (searchFilter) {
    // * sovrascrivo l'array delle pizze con l'array filtrato
    // * per ogni pizza dell'array eseguo il seguente filtro:
    pizzas = pizzas.filter((pizza) => {
      // * normalizzo i parametri del filtro (tutto LC, senza spazi prima o dopo)
      const normalizedName = pizza.name.toLowerCase().trim();
      const normalizedFilter = searchFilter.toLowerCase().trim();

      // * confronto sul nome
      // * se il termine del filtro  è nel nome, mantengo l'elemento nell'array finale
      if (normalizedName.includes(normalizedFilter)) return true;

      // * confronto sugli ingredienti
      // * per ogni ingrediente della pizza
      for (const ing of pizza.ingredients) {
        // * normalizzo l'ingrediente (tutto LC, senza spazi prima o dopo)
        const normalizedIngredient = ing.toLowerCase().trim();

        // * se il termine filtro è nell'ingrediente, mantengo l'elemento nell'array finale
        if (normalizedIngredient.includes(normalizedFilter)) return true;
      }

      // * se non ho ritornato true fin'ora, nessuna comparazione è riuscita
      // * elemento è da scartare
      return false;
    });
  }

  // * construisco l'oggetto della risposta
  const responseData = {
    // * normalizzo gli oggetti pizza prima dell'output
    result: pizzas.map(buildPizzaObject),
    message: `Lista della pizze`,
    success: true,
  };

  // * invio la risposta
  res.json(responseData);
}

function show(req, res) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  const pizzas = [...pizzasData];

  // * recupero l'id della richiesta e lo parso come intero
  const pizzaId = parseInt(req.params.id);

  // * recupero la pizza con l'id corrispondente dal "database"
  // * NB: non è detto che sia stata recuperata una pizza
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  // * se la pizza non è stata trovata
  if (!pizza) {
    // * preparo risposta di errore "not found"
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    // * invio risposta di errore con codice 404
    return res.status(404).json(responseData);
  }

  // * se sono arrivato qui, non c'è stato nessun errore
  // * costruisco la risposta di successo
  const responseData = {
    // * normalizzo l'oggetto pizza prima dell'output
    result: buildPizzaObject(pizza),
    message: `Dettaglio della pizza ${pizzaId}`,
    success: true,
  };

  // * invio la risposta di successo
  res.json(responseData);
}

function store(req, res) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  let pizzas = [...pizzasData];

  // * estraggo dal body i campi validati
  const { name, ingredients } = req.body;
  const { filename } = req.file;
  const image = "imgs/pizze/" + filename;

  // * calcolo l'id della nuova pizza (maxId + 1)
  let maxId = 0;
  pizzas.forEach((pizza) => {
    if (pizza.id > maxId) maxId = pizza.id;
  });
  const newPizzaId = maxId + 1;

  // * construisco l'oggetto della nuova pizza
  const newPizza = {
    // * mi assicuro di includere l'id generato
    id: newPizzaId,
    // * aggiungo i campi precedentemente validati
    name: name.trim(),
    image,
    ingredients,
  };

  // * "salvo" la nuova pizza nel "database"
  pizzasData.push(newPizza);

  // * construisco l'oggetto della risposta
  const responseData = {
    result: newPizza,
    message: `Pizza creata`,
    success: true,
  };

  // * invio la risposta di successo
  res.status(201).json(responseData);
}

function update(req, res) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  let pizzas = [...pizzasData];

  // * recupero l'id della richiesta e lo parso come intero
  const pizzaId = parseInt(req.params.id);

  // * recupero la pizza con l'id corrispondente dal "database"
  // * NB: non è detto che sia stata recuperata una pizza
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  // * se la pizza non è stata trovata
  if (!pizza) {
    // * preparo risposta di errore "not found"
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    // * invio risposta di errore con codice 404
    return res.status(404).json(responseData);
  }

  // * cancello la sua immagine
  const imagePath = "./public/" + pizza.image;
  fs.unlink(imagePath, (err) => {
    if (err) throw err;
    console.log("File deleted successfully");
  });

  // * se sono arrivato qui, tutte le validazioni sono passate
  // * posso sostutituire tutti i dati della pizza recuperata precedentemente per id
  const { filename } = req.file;
  const image = "imgs/pizze/" + filename;

  pizza.name = req.body.name;
  pizza.image = image;
  pizza.ingredients = req.body.ingredients;

  // * costruisco la risposta di successo
  const responseData = {
    // * normalizzo l'oggetto pizza prima dell'output
    result: buildPizzaObject(pizza),
    message: `Modifica intera della pizza ${pizzaId}`,
    success: true,
  };

  // * invio la risposta di successo
  res.json(responseData);
}

function modify(req, res) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  let pizzas = [...pizzasData];

  // * recupero l'id della richiesta e lo parso come intero
  const pizzaId = parseInt(req.params.id);

  // * recupero la pizza con l'id corrispondente dal "database"
  // * NB: non è detto che sia stata recuperata una pizza
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  // * se la pizza non è stata trovata
  if (!pizza) {
    // * preparo risposta di errore "not found"
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    // * invio risposta di errore con codice 404
    return res.status(404).json(responseData);
  }

  // * se sono arrivato qui, tutte le validazione sono passate.
  // * non posso comunque essere certo di quali dati mancavano nel body
  // * devo controllarli uno per uno prima di modificare

  // * se nella richiesta c'era "name", lo aggiorno
  if (req.body.name) pizza.name = req.body.name;

  // * se nella richiesta c'era il "image", lo aggiorno
  if (req.body.image) pizza.image = req.body.image;

  // * se nella richiesta c'era il "ingredients", lo aggiorno
  if (req.body.ingredients) pizza.ingredients = req.body.ingredients;

  // * costruisco la risposta di successo
  const responseData = {
    // * normalizzo l'oggetto pizza prima dell'output
    result: buildPizzaObject(pizza),
    message: `Modifica parziale della pizza ${pizzaId}`,
    success: true,
  };

  // * invio la risposta di successo
  res.json(responseData);
}

function destroy(req, res) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  const pizzas = [...pizzasData];

  // * recupero l'id della richiesta e lo parso come intero
  const pizzaId = parseInt(req.params.id);

  // * recupero la pizza con l'id corrispondente dal "database"
  // * NB: non è detto che sia stata recuperata una pizza
  const pizza = pizzas.find((pizza) => pizza.id === pizzaId);

  // * cancello la sua immagine
  const imagePath = "./public/" + pizza.image;
  fs.unlink(imagePath, (err) => {
    if (err) throw err;
    console.log("File deleted successfully");
  });

  // * se ho trovato la pizza, la filtro via dall'array delle pizze
  // * poi "sovrascrivo" il "database" con l'array aggiornato
  pizzasData = pizzas.filter((pizza) => pizza.id !== pizzaId);

  // * preparo l'oggetto della risposta
  const responseData = {
    // * normalizzo l'oggetto pizza prima dell'output
    result: buildPizzaObject(pizza),
    message: `Eliminazione della pizza ${pizzaId}`,
    success: true,
  };

  // * invio la risposta di successo
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
