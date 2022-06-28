/*
  CloudData is used to store key/value pairs for a particular email
*/
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var cloudDataSchema = Schema( {
  email: String,
  key: String,
  value: String,
} );

module.exports = mongoose.model( 'CloudDatum', cloudDataSchema );
