'use strict';

let mongoose = require('mongoose');
let con =  require('../../config/db')();

// DCL for project
module.exports = () => {
  let Schema = mongoose.Schema;

  let areasSchema = new Schema({
    name:  String,
    created:  Date,
    updated: { type: Date, default: Date.now }
  });
  let Areas = mongoose.model('Areas', areasSchema);
  return Areas;
};
