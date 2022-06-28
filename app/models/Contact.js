'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var contactSchema = Schema( {
  name: String,
  email: String,
  phone: String,
  comments: String,
  createdAt: Date,
} );

module.exports = mongoose.model( 'ContactItem', contactSchema );

