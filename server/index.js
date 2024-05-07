const express = require('express');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_ice_cream_shop');

const app = express();
app.use(express.json());
app.use(require('morgan')('dev'));

// static routes for deployment only

// app routes



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