let pizzasData = require("../data/pizzas");

function payload(req, res, next) {
  // console.log(req.file);

  const validateEveryField = req.method === "POST" || req.method === "PUT";

  // * se non c'è il body, la richiesta non è validabile
  if (!req.body) {
    // * se la validazione non è passata
    // * invio risposta con chiave "success" impostata su "false"
    return res.status(400).json({
      message: `Payload non leggibile`,
      success: false,
    });
  }

  // * se il body è valido
  // * recupero dal body gli elementi da validare
  const { name, image, ingredients } = req.body;

  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  let pizzas = [...pizzasData];

  // * controllo se la validazione è forzata su tutti i campi
  // * o se è stato ricevuto il campo "name".
  // * se una delle due è vera, procedo a validarlo
  if (validateEveryField || name !== undefined) {
    // * per il campo "name", la validazione non passa se il campo non esiste
    // * oppure se il campo non è una stringa
    if (!name || typeof name !== "string") {
      // * se la validazione non è passata
      // * invio risposta con chiave "success" impostata su "false"
      return res.status(400).json({
        message: `Name non valido`,
        success: false,
      });
    }

    // * per il campo "name", la validazione non passa se il campo non è "unico"
    // * perciò controllo su tutte le pizze se il nome corrisponde a quello di un'altra
    if (pizzas.some((pizza) => pizza.name === name)) {
      // * se la validazione non è passata
      // * invio risposta con chiave "success" impostata su "false"
      return res.status(400).json({
        message: `Name pizza già esistente`,
        success: false,
      });
    }
  }

  // * controllo se la validazione è forzata su tutti i campi
  // * o se è stato ricevuto il campo "image".
  // * se una delle due è vera, procedo a validarlo
  if (validateEveryField || req.file !== undefined) {
    // * per il campo "image", la validazione non passa se il campo non esiste
    // * oppure se il campo non è una stringa
    if (!req.file || !req.file.mimetype.includes("image")) {
      // * se la validazione non è passata
      // * invio risposta con chiave "success" impostata su "false"
      return res.status(400).json({
        message: `File immagine non valido`,
        success: false,
      });
    }
  }

  // * controllo se la validazione è forzata su tutti i campi
  // * o se è stato ricevuto il campo "ingredients".
  // * se una delle due è vera, procedo a validarlo
  if (validateEveryField || ingredients !== undefined) {
    // * per il campo "ingredients", la validazione non passa se il campo non esiste
    // * oppure se il campo non è un array
    // * oppure se l'array è vuoto
    // TODO: controllare che gli elementi siano tutte stringhe
    // TODO: e che non siano vuoti
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      // * se la validazione non è passata
      // * invio risposta con chiave "success" impostata su "false"
      return res.status(400).json({
        message: `Ingredienti non validi`,
        success: false,
      });
    }
  }

  // * se sono arrivato qui, tutte le validazioni sono passate
  // * invoco next
  next();
}

function exists(req, res, next) {
  // * copio l'array del "database" per poterlo manipolare senza
  // * compromettere i dati a runtime
  const pizzas = [...pizzasData];

  // * recupero l'id della richiesta e lo parso come intero
  const pizzaId = parseInt(req.params.id);

  // * recupero la pizza con l'id corrispondente dal "database"
  // * NB: non è detto che sia stata recuperata una pizza
  const pizzaExists = pizzas.some((pizza) => pizza.id === pizzaId);

  // * se la pizza non è stata trovata
  if (!pizzaExists) {
    // * preparo risposta di errore "not found"
    const responseData = {
      message: `Pizza ${pizzaId} non trovata`,
      success: false,
    };

    // * invio risposta di errore con codice 404
    return res.status(404).json(responseData);
  }

  next();
}

module.exports = { exists, payload };
