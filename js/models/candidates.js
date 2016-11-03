'use strict';

let mongoose = require('mongoose');
let con =  require('../../config/db')();

// DCL for project
module.exports = () => {
  let Schema = mongoose.Schema;

  let candidatesSchema = new Schema({
    name:  String,
    email: String,
    bio:   String,
    phone: String,
    birthday: Date,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    links:   [String],
    area:    { type: Schema.Types.ObjectId, ref: 'Areas'},
  });
  let Candidates = mongoose.model('Candidates', candidatesSchema);
  return Candidates;
};
