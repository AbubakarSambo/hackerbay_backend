let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)
describe('Logging in', () => {
  describe('/Login', () => {
    it('should return a token, given any username and password', (done) => {
      let user = {
        username: 'siriusBlack',
        password: 'Azkaban'
      }
      chai.request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('token')
          done()
        })
    })
    it('should not return a token, when a required field is missing', (done) => {
      let user = {
        username: 'siriusBlack'
      }
      chai.request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('error')
          done()
        })
    })
  })
})

describe('Patching a json object', () => {
  let token = ''
  beforeEach((done) => {
    let user = {
      username: 'siriusBlack',
      password: 'Azkaban'
    }
    chai.request(server)
      .post('/login')
      .send(user)
      .end((err, res) => {
        token = res.body.token
        done()
      })
  })
  describe('/patch', () => {
    it('should return a 403 if no token is provided', (done) => {
      let url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSayiZ1AGdLqpjNnK0fZ4nuk4U5K4ydzX5vzpets19021WZqRNH4A'
      chai.request(server)
        .post('/thumbnail')
        .send({ url: url })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
    it('should return a 500 if unable to verify token', (done) => {
      let url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSayiZ1AGdLqpjNnK0fZ4nuk4U5K4ydzX5vzpets19021WZqRNH4A'
      chai.request(server)
        .post('/thumbnail')
        .set('Authorization', token + 'f')
        .send({ url: url })
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
    })
    it('should return a patched json object, given a json patch object and a json object', (done) => {
      let json = {
        'baz': 'qux',
        'foo': 'bar'
      }
      let patchObj = [
        { 'op': 'replace', 'path': '/baz', 'value': 'ddddww' },
        { 'op': 'replace', 'path': '/foo', 'value': 'ffff' }
      ]
      chai.request(server)
        .post('/patch')
        .set('Authorization', token)
        .send({ json, patchObj })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('patched')
          done()
        })
    })
    it('should return an invalid patch message, when the patch object is wrong', (done) => {
      let json = {
        'baz': 'qux',
        'foo': 'bar'
      }
      let patchObj = [
        { 'op': 'replace', 'path': '/baz', 'value': 'ddddww' },
        { 'falsevaluehere': 'replace', 'path': '/foo', 'value': 'ffff' }
      ]
      chai.request(server)
        .post('/patch')
        .set('Authorization', token)
        .send({ json, patchObj })
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('error')
          res.body.should.have.property('error').eql('Invalid patch')
          done()
        })
    })
    it('should return an error when required field is missing', (done) => {
      let wrongNAme = {
        'baz': 'qux',
        'foo': 'bar'
      }
      let patchObj = [
        { 'op': 'replace', 'path': '/baz', 'value': 'ddddww' },
        { 'orp': 'replace', 'path': '/foo', 'value': 'ffff' }
      ]
      chai.request(server)
        .post('/patch')
        .set('Authorization', token)
        .send({ wrongNAme, patchObj })
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('error')
          res.body.should.have.property('error').eql('Required fields missing')
          done()
        })
    })
  })
})

describe('Returning a thumbnail from a URL', () => {
  let token = ''
  beforeEach((done) => {
    let user = {
      username: 'siriusBlack',
      password: 'Azkaban'
    }
    chai.request(server)
      .post('/login')
      .send(user)
      .end((err, res) => {
        token = res.body.token
        done()
      })
  })
  describe('/thumbnail', () => {
    it('should return a 403 if no token is provided', (done) => {
      let url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSayiZ1AGdLqpjNnK0fZ4nuk4U5K4ydzX5vzpets19021WZqRNH4A'
      chai.request(server)
        .post('/thumbnail')
        .send({ url: url })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
    it('should return a 500 if unable to verify token', (done) => {
      let url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSayiZ1AGdLqpjNnK0fZ4nuk4U5K4ydzX5vzpets19021WZqRNH4A'
      chai.request(server)
        .post('/thumbnail')
        .set('Authorization', token + 'f')
        .send({ url: url })
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
    })
    it('should return a base64 encoded string after resizing image in the url', (done) => {
      let url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSayiZ1AGdLqpjNnK0fZ4nuk4U5K4ydzX5vzpets19021WZqRNH4A'
      chai.request(server)
        .post('/thumbnail')
        .set('Authorization', token)
        .send({ url: url })
        .end((err, res) => {
          res.should.have.status(200)
          res.text.should.be.a('string')
          done()
        })
    })
    it('should return a 400 error if the url is not for an image', (done) => {
      let url = 'http://facebook.com'
      chai.request(server)
        .post('/thumbnail')
        .set('Authorization', token)
        .send({ url: url })
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('error')
          res.body.should.have.property('error').eql('Sure thats an image?')
          done()
        })
    })
    it('should return a 400 error if the url is missing', (done) => {
      chai.request(server)
        .post('/thumbnail')
        .set('Authorization', token)
        .send({ nothing: 'url' })
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.have.property('error')
          res.body.should.have.property('error').eql('url is missing')
          done()
        })
    })
  })
})
