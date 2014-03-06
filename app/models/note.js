'use strict';

module.exports = Note;
var Mongo = require('mongodb');
var notes = global.nss.db.collection('notes');
var _ = require('lodash');

function Note(note){
  this.title = note.title;
  this.body = note.body;
  this.dateCreated = note.dateCreated ? new Date(note.dateCreated) : new Date();
  this.tags = note.tags.split(',').map(function(tag){return tag.trim();});
  this.tags = _.compact(this.tags);
  this.userId = new Mongo.ObjectID(note.userId);
}

Note.prototype.insert = function(fn){
  notes.insert(this, function(err, record){
    fn(record);
  });
};

Note.prototype.update = function(fn){
  notes.update({_id:this._id},this, function(err, count){
    fn(count);
  });
};

Note.prototype.delete = function(fn){
  notes.remove({_id:this._id}, function(err, count){
    fn(count);
  });
};

Note.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  notes.remove({_id:_id}, function(err, deleted){
    fn(deleted);
  });
};


Note.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  notes.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, Note.prototype));
  });
};

Note.findAllByUserId = function(id, fn){
  var userId = Mongo.ObjectID(id);
  notes.find({userId:userId}).toArray(function(err, notes){
    fn(notes);
  });
};

Note.find = function(query, fn){
  var limit = query.limit || 10;
  var skip = query.page ? (query.page - 1) * limit : 0;
  var filter = {};
  var sort = [];
  var userId = query.userId;

  filter.userId = userId;

  filter[query.filterName] = query.filterValue;

  if(query.sort){
    var direction = query.direction ? query.direction * 1 : 1;
    sort.push([query.sort, direction]);
  }

  notes.find(filter, {sort:sort, skip:skip, limit:limit}).toArray(function(err, records){
    fn(records);
  });
};
