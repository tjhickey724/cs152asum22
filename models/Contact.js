'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var contactSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  name: String,
  email: String,
  phone: String,
  comments: String,
} );

module.exports = mongoose.model( 'ContactItem', contactSchema );

