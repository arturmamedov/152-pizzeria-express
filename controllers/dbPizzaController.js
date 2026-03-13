const connection = require('../db/connection');

/**
 * Funzione che risponde alla richiesta ricevuta con
 * la lista delle pizze presenti in database
 *
 * @param {*} req
 * @param {*} res
 */
function index(req, res) {
    // prepariamo la query
    const sql = 'SELECT * FROM pizzas';

    // eseguiamo la query!
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database query failed'
            });
        }

        // * invio la risposta
        res.json({
            success: true,
            message: 'Lista della pizze',
            result: results.map(pizza => buildPizzaObject(pizza))
        });
    });
}

function show(req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id

    const sql = 'SELECT * FROM pizzas WHERE id = ?';

    // Prepariamo la query per gli ingredienti aiutandoci con una join e Where
    const ingredientsSql = `
        SELECT I.*
        FROM ingredients AS I
        JOIN ingredient_pizza AS IP ON I.id = IP.ingredient_id
        WHERE IP.pizza_id = ?
    `;

    connection.query(sql, [id], function (err, results) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database query failed'
            });
        }

        if (results.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Pizza not found.'
            });
        }

        // * salvo la pizza in una variabile
        // { "id": 1,"name": "Margherita","image": "margherita.webp" }
        const pizza = results[0];
        // console.log(pizza)

        // Se è andata bene, eseguiamo la seconda query per gli ingredienti
        connection.query(ingredientsSql, [id], (err, ingredientsResults) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database query failed'
                });
            }

            // console.log('ingredients')
            // console.log(ingredientsResults)

            // Aggoiungiamo gli ingredienti alla pizza
            pizza.ingredients = ingredientsResults;

        // * invio la risposta di successo
        res.json({
            success: true,
            message: `Dettaglio della pizza ${results[0].id}: ${results[0].name}`,
                result: buildPizzaObject(pizza)
            });
        });
    })
}

function store(req, res) {
    //recuperiamo i dati dal corpo della richiesta
    const { name, image } = req.body;
    // prepariamo la query
    const sql = 'INSERT INTO pizzas (name, image) VALUES (?, ?)';

    // eseguiamo la query
    connection.query(
        sql,
        [name, image],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to insert pizza'
                });
            }

            // console.log(results)

            res.status(201).json({
                success: true,
                message: 'Pizza inserita',
                id: results.insertId // restituiamo l'id assegnato dal DB (Auto Increment)
            });
        }
    );
}

function update(req, res) {
    // * invio la risposta di successo
    res.json({});
}

function modify(req, res) {
    // * invio la risposta di successo
    res.json({});
}

function destroy(req, res) {
    // * invio la risposta di successo
    res.json({});
}

const buildPizzaObject = (pizza) => {
    const imageAbsolutePath = "http://localhost:3000/" + pizza.image;
    return {
        ...pizza,
        image: imageAbsolutePath,
    };
};

module.exports = { index, show, store, update, modify, destroy };
