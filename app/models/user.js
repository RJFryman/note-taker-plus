'use strict';

module.exports = User;
var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');

function User(user){
  this.email = user.email;
  this.password = user.password;
}

User.prototype.hashPassword = function(fn){
  var self = this;
  bcrypt.hash(self.password, 8, function(err, hash){
    self.password = hash;
    fn(err);
  });
};

User.prototype.insert = function(fn){
  var self = this;
  users.findOne({email:self.email}, function(err, record){
    if(!record){
      users.insert(self, function(err, records){
        fn(records);
      });
    }
    else{
      fn(err);
    }
  });
};

User.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result === true){
          fn(record);
        }
        else{
          fn(null);
        }
      });
    }
    else{
      fn(null);
    }
  });
};
