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
            result: results
        });
    });
}

function show(req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id

    const sql = 'SELECT * FROM pizzas WHERE id = ?';

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

        // * invio la risposta di successo
        res.json({
            success: true,
            message: `Dettaglio della pizza ${results[0].id}: ${results[0].name}`,
            result: results
        });
    })
}

function store(req, res) {
    // * invio la risposta di successo
    res.status(201).json({});
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
