'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var todoSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  descr: String,
  completed: Boolean,
  createdAt: Date,
} );

module.exports = mongoose.model( 'ToDoItem', todoSchema );

