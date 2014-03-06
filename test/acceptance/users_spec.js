'use strict';

process.env.DBNAME = 'notes-app';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User;

describe('users', function(){

  var u1;

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({email:'adam@adam.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(){
          done();
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /auth', function(){
    it('should display the auth page', function(done){
      request(app)
      .get('/auth')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('User Authentication Page');
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register a user', function(done){
      request(app)
      .post('/register')
      .field('email', 'adam@thede.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
    
    it('should not register a user due to duplicate', function(done){
      request(app)
      .post('/register')
      .field('email', 'adam@adam.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('User Authentication Page');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should allow a successful login', function(done){
      request(app)
      .post('/login')
      .field('email', 'adam@adam.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not allow an unsuccessful login', function(done){
      request(app)
      .post('/login')
      .field('email', 'adam@me.com')
      .field('password', '1244')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('User Authentication Page');
        done();
      });
    });
  });
});
