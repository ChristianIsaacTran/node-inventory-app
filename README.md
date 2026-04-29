# purpose of this repo

- This repo is part of the node.js for the "inventory app" portion of the odin project.

- The goal is to practice backend integration with node.js and express servers to connect to a
  postgreSQL database with basic CRUD implementations and features.

- This is also to practice database designs and relations (PK, FK), and also the MVC model. (model, view, controller pattern).

- Routing and GET and POST operations along with some server-side template rendering with EJS.

## project requirements/goals I know so far

- The objective for this project is to make an inventory management app for an imaginary store. The store could be anything and could sell
  anything, but it has to have categories and items.

- When the user visits the home page of the site, they should be able to get a list of the different category for the items and get a view of
  every item in that category. Ex: if user chooses food, should get a list/display all food items.

- Also should implement CRUD operations for each category, so that users can (Create, Read, Update, or Delete) any category or item.

- SQL database should establish relations between them. (database design)

- After project is done and finished, make sure to create a database script that creates and seeds initial data both in the local database and
  deployment database.

- Deploy the project onto a hosting provider after finishing.

## SQL relationships

- In SQL, relational databases establish relationships between tables through a primary key, and a foreign key (usually a unique ID column in each table).

- For the tables, there are 4 main types of relationships:

        - one-to-one: When one record can relate to one record
            ex: one state only has one capital in it

        - one-to-many: when one record can relate to many records
            ex: one baseball team can have many players in it

        - many-to-one: when many records can relate to one record
            ex: many employees work for one department

        - many-to-many: when many records can relate to many records
            note: this usually requires a 3rd table to join the two
            tables of data together.

            ex: many students can enroll in many classes

note: also, postgreSQL recommends to use a lowercase snakecase. DO NOT USE UPPCASE LETTERS IN TABLE OR COLUMN NAMES.

ex: 

        - This is bad: 
        TableNameOne

        - Do lowercase snakecase instead:
        table_name_one

        it is recommended on the postgreSQL wiki "Don't do this" section.

## topic of the inventory app

- I want to create an inventory management app that uses fortnite weapons and items for this current season and chapter (at the time of writing, fortnite is currently in Chapter 7 season 2: Showdown )

SQL related relationship notes for fortnite items:

- A fortnite BR item can only have 1 type-category in it. (resource, assault rifle, etc.)

- A fortnite BR item can have MULTIPLE rarities associated with the same item

- A fortnite BR GUN item can only have ONE ammo-type

- A fortnite item can only have ONE max_carry_amount

note: there are some guns in fortnite that use 2 types of ammo, but to keep it simple I am ignoring those.

SQL data columns:

Main tables in the database:

    Weapons table:
    1. Item_name VARCHAR(50)
    2. Item_type VARCHAR(50) FK
    3. Item_rarity VARCHAR(50) FK
    4. bullet_type VARCHAR(50)
    5. mag_size INTEGER
    6. damage INTEGER
    7. dps INTEGER
    8. crit INTEGER
    9. fire_rate DECIMAL
    10.reload_time DECIMAL

    Consumables table:
    1. Item_name VARCHAR(50)
    2. Item_type VARCHAR(50) FK
    3. Item_rarity VARCHAR(50) FK
    4. (optional, can be 0) heal_amount INTEGER
    5. (optional, can be 0) shield_amount INTEGER
    6. (optional, can be null) effect VARCHAR(50)

    Utility Table:
    1. Item_name VARCHAR(50)
    2. Item_type VARCHAR(50) FK
    3. Item_rarity VARCHAR(50) FK
    4. max_stack INTEGER
    5. Item_description VARCHAR(255)

    Type Table:
    1. id INTEGER PK
    2. type VARCHAR(50)

    Rarity table:
    1. id INTEGER PK
    2. rarity VARCHAR(50)

note: To keep this simple I am not going to make entries for
the miscellaneous stuff, like building mats or vehicles, etc.
