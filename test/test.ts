import { expect } from 'chai';
import 'mocha';

import { DbHandler, MySQL } from '../lib';

let dbs = new DbHandler({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PWD
});

describe('#DbHandler', function () {
  after(async function () {
    dbs.all().forEach((db) => {
      db.end();
    })
  });

  it('should be a instance of DbHandler', function () {
    expect(dbs).to.be.instanceOf(DbHandler);
  });

  it('should be an empty array', function () {
    const dbArray = dbs.all();
    expect(dbArray).to.be.empty;
    expect(dbArray).to.be.an('array');
  });

  it('should connect to a database', async function () {
    const dbName: string = process.env.DB_FIRST_DATABASE || 'first';
    const firstPool: MySQL.Pool = dbs.get(dbName);

    const result = await firstPool.query("SELECT DATABASE();");
    expect(result[0]['DATABASE()']).to.be.a('string');
    expect(result[0]['DATABASE()']).to.equal(dbName);
  });

  it('should now have one db', function () {
    const dbArray = dbs.all();
    expect(dbArray).to.be.an('array');
    expect(dbArray).to.have.lengthOf(1);
  });

  it('should connect to a second database', async function () {
    const dbName: string = process.env.DB_SECOND_DATABASE || 'second';
    const secondPool: MySQL.Pool = dbs.get(dbName);

    const result = await secondPool.query("SELECT DATABASE();");
    expect(result[0]['DATABASE()']).to.be.a('string');
    expect(result[0]['DATABASE()']).to.equal(dbName);
  });

  it('should now have two dbs', function () {
    const dbArray: MySQL.Pool[] = dbs.all();
    expect(dbArray).to.have.lengthOf(2);
  });
});