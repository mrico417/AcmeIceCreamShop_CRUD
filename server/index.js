// import express and pg
const express = require('express');
const pg = require('pg');

// create new client to database with pg
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_ice_cream_shop');

// create and express app for HTTP request
const app = express();

// prep the app to use response to json request
app.use(express.json());

// prep the app to use morgan for logging
app.use(require('morgan')('dev'));

// static routes for deployment only

// app routes

// get all the flavors
app.get('/api/flavors', async (req, res, next) => {

    try {
        const selectAllSQL = `
            SELECT * FROM flavors
        ;`;

        const response = await client.query(selectAllSQL);
        res.send(response.rows);

    } catch (error) {
        next(error);
    }


});

// get one flavor by id
app.get('/api/flavors/:id', async (req, res, next) => {

    try {

        const selectByIdSQL = ` 
            SELECT id, name, is_favorite FROM flavors
            WHERE id=$1
        ;`;

        const response = await client.query(selectByIdSQL,[req.params.id]);
        res.send(response.rows[0]);
        
    } catch (error) {
        next(error);
    }
});

// insert a new flavor and send new flavor as json object
app.post('/api/flavors', async (req, res, next) => {

    try {
        
        const insertSQL = `
            INSERT INTO flavors(name,is_favorite) VALUES($1,$2)
            RETURNING *
        ;`;

        const response = await client.query(insertSQL,[req.body.name,req.body.is_favorite]);
        res.send(response.rows[0]);

    } catch (error) {
        next(error);
    }


});

// delete flavor by id and sendStatus of 204 for success
app.delete('/api/flavors/:id', async (req, res, next) => {

    try {
        const deleteByIdSQL = `
            DELETE FROM flavors
            WHERE id=$1
        ;`;

        const response = await client.query(deleteByIdSQL, [req.params.id]);
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }


});

// update flavor by id and send updated entry as json object
app.put('/api/flavors/:id', async (req, res, next) => {

    try {
        const updateByIdSQL = `
            UPDATE flavors
            SET name=$1, is_favorite=$2, updated_at=now()
            WHERE id=$3
            RETURNING *
        ;`;

        const response = await client.query(updateByIdSQL, [req.body.name, req.body.is_favorite, req.params.id]);
        res.send(response.rows[0]);

    } catch (error) {
        next(error);
    }


});

// create the tables with dummy data and prep the app to list on specific port
const init = async() => {

    try {
        
        // start connection to client db
        await client.connect();


        const SQL = ` 
            DROP TABLE IF EXISTS flavors;
            CREATE TABLE flavors(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                is_favorite BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );

            INSERT INTO flavors(name) values('butter pecan');
            INSERT INTO flavors(name) values('rockey road');
            INSERT INTO flavors(name) values('french vanilla');
            INSERT INTO flavors(name) values('chocolatey');
        `;
    
        // execute the SQL CREATE and INSERT statementS
        const response = await client.query(SQL);
        console.log("Created database and loaded it with dummy data...");
    
        // prep the app to listen for requests
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, ()=> console.log(`App listening on port ${PORT}...`));

    } catch (error) {
        console.log(error);
        next(error);
    }

};

init();