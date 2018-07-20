import * as MySQL from 'promise-mysql';

export { MySQL };

interface PoolMap {
  [index: string]: MySQL.Pool;
}

export class DbHandler {
  readonly options: MySQL.PoolConfig;
  readonly pools: PoolMap;

  constructor(connOptions: MySQL.PoolConfig) {
    this.options = connOptions;
    this.pools = {};
  }

  get(dbName: string): MySQL.Pool {
    if (!this.pools[dbName]) {
      let poolInitialization = {...this.options};
      poolInitialization.database = dbName;
      this.pools[dbName] = MySQL.createPool(poolInitialization);
      console.log(dbName.toString() + " connection created");
    }

    return this.pools[dbName];
  }

  all(): MySQL.Pool[] {
    let dbArray: MySQL.Pool[] = [];
    for (let db in this.pools) {
      if (this.pools.hasOwnProperty(db)) {
        dbArray.push(this.pools[db]);
      }
    }
    return dbArray;
  }
}