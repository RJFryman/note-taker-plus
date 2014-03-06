'use strict';

//var Album = require('../models/album');

exports.index = function(req, res){
  res.render('home/index', {title: 'My Note App'});
};

