'use strict';

var Note = require('../models/note');

exports.index = function(req, res){
  Note.findAllByUserId(req.session.userId, function(notes){
    res.render('notes/index', {title: 'Your Cool Notes', notes:notes});
  });
};

exports.new = function(req, res){
  res.render('notes/new', {title: 'Create a NEW Cool Note'});
};

exports.create = function(req, res){
  var note = new Note(req.body);
  note.insert(function(){
    res.redirect('/notes');
  });
};

exports.delete = function(req, res){
  Note.deleteById(req.params.id, function(){
    res.redirect('notes/index');
  });
};

exports.show = function(req, res){
  Note.findById(req.params.id, function(note){
    res.render('notes/show', {note:note});
  });
};
