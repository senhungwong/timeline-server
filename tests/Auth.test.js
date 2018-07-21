const bootstrap   = require('./bootstrap');
const chai        = bootstrap.getChai();
const should      = chai.should();
const UserFactory = require('../database/factories/UserFactory');

describe('AuthController tests', () => {
    let server;

    before(done => {
        server = bootstrap.connect();
        done();
    });

    beforeEach(done => {
        bootstrap.removeAllDBRecords();
        done();
    });

    describe('Test username uniqueness check', () => {
        it('should return username is not taken', done => {
            chai.request(server)
                .post('/api/v1/auth/uniqueness/username')
                .send({
                    username: 'test_username',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('isTaken');
                    res.body.isTaken.should.be.equal(false);
                    done();
                });
        });

        it('should return username is been taken', done => {
            UserFactory.create('test_username').then(user => {
                chai.request(server)
                    .post('/api/v1/auth/uniqueness/username')
                    .send({
                        username: 'test_username',
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('isTaken');
                        res.body.isTaken.should.be.equal(true);
                        done();
                    });
            });
        });
    });

    describe('Test user registration', () => {
        it('should register a new user', done => {
            chai.request(server)
                .post('/api/v1/auth/register')
                .send({
                    username: 'test_username',
                    password: 'test_password',
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('user');
                    res.body.should.have.property('token');
                    res.body.user.username.should.be.equal('test_username');
                    done();
                });
        });

        it('should get username already taken error message', done => {
            UserFactory.create('test_username').then(user => {
                chai.request(server)
                    .post('/api/v1/auth/register')
                    .send({
                        username: 'test_username',
                        password: 'test_password',
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('messages');
                        res.body.messages.should.be.an('array');
                        done();
                    });
            });
        });
    });

    describe('Test user login', () => {
        it('should login a user', done => {
            UserFactory.create('test_username', 'test_password').then(user => {
                chai.request(server)
                    .post('/api/v1/auth/login')
                    .send({
                        username: 'test_username',
                        password: 'test_password',
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        res.body.should.have.property('user');
                        res.body.token.should.be.a('string');
                        res.body.user.should.be.an('object');
                        res.body.user.should.have.property('id');
                        res.body.user.should.have.property('username');
                        res.body.user.username.should.be.equal('test_username');
                        done();
                    });
            });
        });

        it('should fail user login with a wrong password', done => {
            UserFactory.create('test_username', 'test_password').then(user => {
                chai.request(server)
                    .post('/api/v1/auth/login')
                    .send({
                        username: 'test_username',
                        password: 'wrong_password',
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('messages');
                        res.body.messages.should.be.an('array');
                        done();
                    });
            });
        });
    });

    describe('Test username/password validator', () => {
        it('should reject since username is longer than 20', done => {
            chai.request(server)
                .post('/api/v1/auth/uniqueness/username')
                .send({
                    username: 'test_user_name_has_longer_than_twenty_chars',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.an('object');
                    done();
                });
        });

        it('should reject since username is shorter than 5', done => {
            chai.request(server)
                .post('/api/v1/auth/uniqueness/username')
                .send({
                    username: 'test',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.an('object');
                    done();
                });
        });

        it('should reject since username contains invalid chars', done => {
            chai.request(server)
                .post('/api/v1/auth/uniqueness/username')
                .send({
                    username: 'user-name',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.an('object');
                    done();
                });
        });

        it('should reject since password is shorter than 8', done => {
            chai.request(server)
                .post('/api/v1/auth/register')
                .send({
                    username: 'test_username',
                    password: 'pass',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.an('object');
                    done();
                });
        });
    });

    after(done => {
        bootstrap.removeAllDBRecords();
        bootstrap.disconnect(server);
        done();
    });
});
