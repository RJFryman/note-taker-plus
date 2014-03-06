/* jshint expr:true */

'use strict';

process.env.DBNAME = 'notes-app';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u1 = new User({email:'bob@aol.com', password:'1234'});
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('bob@aol.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('#hashPassword', function(){
    it('should hash the password', function(done){
      var u1 = new User({email:'adam@adam.com', password:'1234'});
      u1.hashPassword(function(){
        expect(u1.password).to.not.equal('1234');
        done();
      });
    });
  });

  describe('#insert', function(){
    var u1;
    var u2;

    beforeEach(function(done){
      u1 = new User({email:'adam@adam.com', password:'1234'});
      u2 = new User({email:'adam@adam.com', password:'1200'});
      u1.hashPassword(function(){
        u2.hashPassword(function(){
          done();
        });
      });
    });

    it('should insert the User in the database', function(done){
      u1.insert(function(){
        expect(u1.password).to.not.equal('1234');
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });

    it('should not insert an already existing email', function(done){
      u1.insert(function(){
        u2.insert(function(){
          expect(u2._id).to.not.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });

  describe('.findById', function(){
    var u1;
    var u2;

    beforeEach(function(done){
      u1 = new User({email:'adam@adam.com', password:'1234'});
      u2 = new User({email:'adam@thede.com', password:'1200'});
      u1.hashPassword(function(){
        u2.hashPassword(function(){
          done();
        });
      });
    });

    it('should find the user by id', function(done){
      u1.insert(function(){
        var id = u1._id.toString();
        u2.insert(function(){
          User.findById(id, function(record){
            expect(record._id.toString()).to.equal(u1._id.toString());
            expect(record.email).to.equal('adam@adam.com');
            done();
          });
        });
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find the user by email and matching password', function(done){
      var u1 = new User({email:'go@getit.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(){
          var email = u1.email;
          var password = '1234';
          User.findByEmailAndPassword(email, password, function(userObj){
            //expect(userObj).to.be.instanceof(User);
            expect(userObj.email).to.equal('go@getit.com');
            done();
          });
        });
      });
    });

    it('should find the user by email and matching password', function(done){
      var u1 = new User({email:'go@getit.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(){
          var email = u1.email;
          var password = '1255';
          User.findByEmailAndPassword(email, password, function(userObj){
            expect(userObj).to.be.null;
            done();
          });
        });
      });
    });

    it('should find the user by email and matching password', function(done){
      var u1 = new User({email:'go@getit.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(){
          var email = 'go@geti.com';
          var password = '1234';
          User.findByEmailAndPassword(email, password, function(userObj){
            expect(userObj).to.be.null;
            done();
          });
        });
      });
    });
  });
});

