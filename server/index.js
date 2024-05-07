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
    
        // execute the SQL CREARTE and INSERT statementS
        const response = await client.query(SQL);
        console.log("Created database and loaded it with dummy data...");
    
        // prep the app to listen for requests
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, ()=> console.log(`App listening on ${PORT}`));

    } catch (error) {
        console.log(error);
        next(error);
    }

};

init();