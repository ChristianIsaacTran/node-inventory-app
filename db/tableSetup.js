const {Client} = require("pg");


/* 
initial database table setup and seeding query

note: the "GENERATED ALWAYS AS IDENTITY" marks that column as 
an "identity column" in postgreSQL which automatically increments 
that id column when records get added to it.
*/
const SQLQuery = `

    CREATE TABLE IF NOT EXISTS item_type(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        type VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS rarity_type(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
        rarity VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS weapons(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
        item_name VARCHAR(50),
        item_category INTEGER,
        item_rarity INTEGER,
        bullet_type VARCHAR(50),
        mag_size INTEGER,
        damage INTEGER, 
        dps INTEGER, 
        crit INTEGER,
        fire_rate DECIMAL(5,2),
        reload_time DECIMAL(5,2),

        CONSTRAINT fk_type
            FOREIGN KEY(item_category)
            REFERENCES item_type(id),

        CONSTRAINT fk_rarity
            FOREIGN KEY(item_rarity)
            REFERENCES rarity_type(id)
    );

    CREATE TABLE IF NOT EXISTS consumables(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        item_name VARCHAR(50),
        item_category INTEGER,
        item_rarity INTEGER,
        heal_amount INTEGER,
        shield_amount INTEGER, 
        effect VARCHAR(50),

        CONSTRAINT fk_type
            FOREIGN KEY(item_category)
            REFERENCES item_type(id),

        CONSTRAINT fk_rarity
            FOREIGN KEY(item_rarity)
            REFERENCES rarity_type(id)
    
    );

    CREATE TABLE IF NOT EXISTS utilities(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        item_name VARCHAR(50),
        item_category INTEGER,
        item_rarity INTEGER,
        max_stack INTEGER,
        item_description VARCHAR(255),

        CONSTRAINT fk_type
            FOREIGN KEY(item_category)
            REFERENCES item_type(id),

        CONSTRAINT fk_rarity
            FOREIGN KEY(item_rarity)
            REFERENCES rarity_type(id)
    );

    
`;


async function main() {
    console.log("Seeding database...");

    // going to use connection info this time around instead of URL
    const client  = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
    });

    await client.connect();
    await client.query(SQLQuery);
    await client.end();

    console.log("Seeding complete.")
}

main();