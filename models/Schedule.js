'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var scheduleSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  courseId: {type:Schema.Types.ObjectId,ref:'Course'},
} );

module.exports = mongoose.model( 'Schedule', scheduleSchema );

