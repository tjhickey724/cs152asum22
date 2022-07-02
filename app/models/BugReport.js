'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var BugReportSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  title: String,
  body: String,
  createdAt: Date,
} );

module.exports = mongoose.model( 'BugReport', BugReportSchema );

