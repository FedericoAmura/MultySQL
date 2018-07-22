MultySQL
========
[![Build Status](https://travis-ci.org/FedericoAmura/multysql.svg?branch=master)](https://travis-ci.org/FedericoAmura/multysql)
[![npm version](https://badge.fury.io/js/multysql.svg)](https://github.com/FedericoAmura/multysql)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

A lazy loader for managing connection pools to multiple MySQL databases

This module is based on [node-promise-mysql](https://github.com/lukeb-uk/node-promise-mysql) module by [lukeb-uk](https://github.com/lukeb-uk) which itself is a wrapper for [MySQL](https://github.com/mysqljs/mysql) client that uses [Bluebird](https://github.com/petkaantonov/bluebird/) promises.
In summary, you can use this module to handle connections with multiple MySQL databases. This module is intended for the situation where you migth need to create connections to new databases in runtime and can't be sure to connect everywhere when starting the app.
Every new database will be lazily connected, that means, when requested for the first use. And it will always be connected using the generic connection configuration passed to `DbHandler` at it's initialization, the only change is the database

## Installation

To install multysql, just use npm or any other similar package manager for javascript:

```sh
$ npm install multysql
```

## Usage

### In TypeScript

```typescript
import { DbHandler, MySQL } from 'multysql';

const genericPoolConfig: MySQL.PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD
    // see node-promise-mysql module for more options
};

let dbs = new DbHandler(genericPoolConfig);

async function requestStuff() {
    // lazy connect the first database, whose name is passed as a string
    const firstPool: MySQL.Pool = dbs.get('firstDatabase');

    // it won't generate a new pool if you try to get it again
    const firstPoolDuplicate: MySQL.Pool = dbs.get('firstDatabase'); // firstPool === firstPoolDuplicate

    let firstDbUserRow = await firstPool.query('SELECT username FROM users ORDER BY username LIMIT 1;');
    let firstDbUsername = firstDbUserRow[0].username; // Annie123

    // now we connect to the second database
    const secondPool: MySQL.Pool = dbs.get('secondDatabase');

    let secondDbUserRow = await secondPool.query('SELECT username FROM users ORDER BY username LIMIT 1;');
    let secondDbUsername = firstDbUserRow[0].username; // Archie456

    // do more stuff with both dbs connected...
}

requestStuff().then(() => {
    // finally we close every pool in our application
    dbs.all().forEach((db) => {
        // this will iterate over firstPool and secondPool ending them
        db.end();
    })
});
```

### In JavaScript

```javascript
const multySQL = require('multysql');

const genericPoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD
    // see node-promise-mysql module for more options
};

let dbs = new multySQL.DbHandler(genericPoolConfig);

async function requestStuff() {
    // lazy connect the first database, whose name is passed as a string
    const firstPool = dbs.get('firstDatabase');

    // it won't generate a new pool if you try to get it again
    const firstPoolDuplicate = dbs.get('firstDatabase'); // firstPool === firstPoolDuplicate

    let firstDbUserRow = await firstPool.query('SELECT username FROM users ORDER BY username LIMIT 1;');
    let firstDbUsername = firstDbUserRow[0].username; // Annie123

    // now we connect to the second database
    const secondPool = dbs.get('secondDatabase');

    let secondDbUserRow = await secondPool.query('SELECT username FROM users ORDER BY username LIMIT 1;');
    let secondDbUsername = firstDbUserRow[0].username; // Archie456

    // do more stuff with both or more dbs connected...
}

requestStuff().then(() => {
    // finally we close every pool in our application
    dbs.all().forEach((db) => {
        // this will iterate over firstPool and secondPool ending them
        db.end();
    })
});
```


# Development

## Build

To build from TypeScript code (located at ./lib directory) type:

```sh
 $ npm run build
```

And built javascript code will be inside ./dist directory

## Tests

In order to run test, you must clone this repository, install dependencies, set the following environment variables and have, at least, two mysql databases set up, with similar user and password.

```sh
 $ git clone https://github.com/FedericoAmura/multysql.git
 $ cd multysql
 $ export DB_HOST=<mysqlHost> # default 'localhost'
 $ export DB_USER=<mysqlUser>
 $ export DB_PWD=<mysqlPassword>
 $ export DB_FIRST_DATABASE=<yourFirstDatabase> # default 'first'
 $ export DB_SECOND_DATABASE=<yourSecondDatabase> # default 'second'
 $ npm install
 $ npm test # run tests in TypeScript
 $ npm jstest # run tests in JavaScript
```

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.