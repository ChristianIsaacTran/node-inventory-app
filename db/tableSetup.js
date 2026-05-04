const { Client } = require("pg");

const format = require("pg-format");

const records = require("./tableRecords");

/* 
initial database table setup and seeding query

note: the "GENERATED ALWAYS AS IDENTITY" marks that column as 
an "identity column" in postgreSQL which automatically increments 
that id column when records get added to it.
*/
const SQLQueryTables = `

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
        dps DECIMAL(5,2), 
        crit DECIMAL(5,2),
        fire_rate DECIMAL(5,2),
        reload_time DECIMAL(5,2),
        image_url VARCHAR(255),
        amount INTEGER,

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
        image_url VARCHAR(255),
        amount INTEGER,

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
        image_url VARCHAR(255),
        amount INTEGER,

        CONSTRAINT fk_type
            FOREIGN KEY(item_category)
            REFERENCES item_type(id),

        CONSTRAINT fk_rarity
            FOREIGN KEY(item_rarity)
            REFERENCES rarity_type(id)
    );
`;

// returns true or false if the table has records in it
async function checkTableSeeded(client, table) {
  const formattedSQL = format(`SELECT * FROM %I`, table);

  const { rows } = await client.query(formattedSQL);

  if (rows.length !== 0) {
    return true;
  } else {
    return false;
  }

  return console.log("Couldn't find rows in result object");
}

async function seedTypeTable(client) {
  const SQLQueryTypeRecords = `
    INSERT INTO item_type(type) 
    VALUES
    ($1),
    ($2),
    ($3),
    ($4),
    ($5),
    ($6),
    ($7),
    ($8),
    ($9),
    ($10);
    `;

  // if there ARE records inside table, then skip seeding
  if (await checkTableSeeded(client, `item_type`)) {
    return console.log("Skip seeding item_type table.");
  }

  await client.query(SQLQueryTypeRecords, records.itemTypeRecords);
  return console.log("Seeded item_type table.");
}

async function seedRarityTable(client) {
  const SQLQueryRarityRecords = `
    INSERT INTO rarity_type(rarity) 
    VALUES
    ($1),
    ($2),
    ($3),
    ($4),
    ($5),
    ($6),
    ($7);
  `;

  // if there ARE records inside table, then skip seeding
  if (await checkTableSeeded(client, `rarity_type`)) {
    return console.log("Skip seeding rarity_type table.");
  }

  await client.query(SQLQueryRarityRecords, records.itemRarityRecords);
  return console.log("Seeded rarity_type table.");
}

async function seedWeaponsTable(client) {
  // using pg-format to do bulk insert
  const formattedWeaponSQL = format(
    `
    INSERT INTO weapons(item_name, item_category, item_rarity, bullet_type, mag_size, damage, dps, crit, fire_rate, reload_time, image_url, amount) 
    VALUES %L`,
    records.weaponRecords,
  );

  // if there ARE records inside table, then skip seeding
  if (await checkTableSeeded(client, `weapons`)) {
    return console.log("Skip seeding weapons table.");
  }

  await client.query(formattedWeaponSQL);
  return console.log("Seeded weapons table.");
}

async function seedUtilityTable(client) {
  // using pg-format to do bulk insert
  const formattedUtilitiesSQL = format(
    `
    INSERT INTO utilities(item_name, item_category, item_rarity, max_stack, item_description, image_url, amount)
    VALUES %L`,
    records.utilityRecords,
  );

  // if there ARE records inside table, then skip seeding
  if (await checkTableSeeded(client, `utilities`)) {
    return console.log("Skip seeding utilities table.");
  }

  await client.query(formattedUtilitiesSQL);
  return console.log("Seeded utilities table.");
}

async function seedConsumablesTable(client) {
  // using pg-format to do bulk insert
  const formattedConsumablesSQL = format(
    `
    INSERT INTO consumables(item_name, item_category, item_rarity, heal_amount, shield_amount, effect, image_url, amount)
    VALUES %L`,
    records.consumablesRecords,
  );

  // if there ARE records inside table, then skip seeding
  if (await checkTableSeeded(client, `consumables`)) {
    return console.log("Skip seeding consumables table.");
  }

  await client.query(formattedConsumablesSQL);
  return console.log("Seeded consumables table.");
}

async function main() {
  console.log("Seeding database...");

  // going to use connection info this time around instead of URL
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  });

  await client.connect();
  await client.query(SQLQueryTables); // create all tables

  // seeding functions
  await seedTypeTable(client);
  await seedRarityTable(client);
  await seedWeaponsTable(client);
  await seedUtilityTable(client);
  await seedConsumablesTable(client);

  await client.end();

  console.log("Seeding complete.");
}

main();
