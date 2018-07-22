const mocha = require('mocha');
const expect = require('chai').expect;

const multySQL = require('../dist/lib');

let dbs = new multySQL.DbHandler({
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
    expect(dbs).to.be.instanceOf(multySQL.DbHandler);
  });

  it('should be an empty array', function () {
    const dbArray = dbs.all();
    expect(dbArray).to.be.empty;
    expect(dbArray).to.be.an('array');
  });

  it('should connect to a database but only the first time', async function () {
    const dbName = process.env.DB_FIRST_DATABASE || 'first';
    const firstPool = dbs.get(dbName);

    const result = await firstPool.query("SELECT DATABASE();");
    expect(result[0]['DATABASE()']).to.be.a('string');
    expect(result[0]['DATABASE()']).to.equal(dbName);

    const firstPoolClone = dbs.get(dbName);
    const resultClone = await firstPoolClone.query("SELECT DATABASE();");
    expect(resultClone[0]['DATABASE()']).to.equal(dbName);
  });

  it('should now have one db', function () {
    const dbArray = dbs.all();
    expect(dbArray).to.be.an('array');
    expect(dbArray).to.have.lengthOf(1);
  });

  it('should connect to a second database', async function () {
    const dbName = process.env.DB_SECOND_DATABASE || 'second';
    const secondPool = dbs.get(dbName);

    const result = await secondPool.query("SELECT DATABASE();");
    expect(result[0]['DATABASE()']).to.be.a('string');
    expect(result[0]['DATABASE()']).to.equal(dbName);
  });

  it('should now have two dbs', function () {
    const dbArray = dbs.all();
    expect(dbArray).to.have.lengthOf(2);
  });
});