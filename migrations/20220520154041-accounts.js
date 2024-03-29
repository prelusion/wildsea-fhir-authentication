'use strict';

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  // dbm = options.dbmigrate;
  // type = dbm.dataType;
  // seed = seedLink;
};

/**
  * Migrates the tables into the MySQL DB.
  * @param db
  */
exports.up = function(db) {
  return db.createTable('accounts', {
    columns: {
      id:  {type: 'int', primaryKey: true, notNull: true, autoIncrement: true},
      fhir_id: {type: 'int', unique: true},
      email: {type: 'string', notNull: true, unique: true},
      password: {type: 'string', notNull: true},
      role: {type: 'string', notNull: true},
      token: {type: 'text'},
      rToken: {type: 'text'},
    },
  });
};

/**
  * Migrates the tables from the MySQL DB.
  * @param db
  */
exports.down = function(db) {
  return db.dropTable('accounts');
};

exports._meta = {
  "version": 1
};
