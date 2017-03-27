var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);


describe('API', function () {
    it('should get TestValue for key TestKey on /object/TestKey GET', function (done) {
        chai.request(server)
            .get('/object/TestKey')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.be.equal("TestValue");
                done();
            });
    });
    it("should add a key value pair", function (done) {
        chai.request(server)
            .post('/object')
            .send({"TestKey": "TestValue"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                res.status.should.equal(200);
                res.body.error.should.equal(false);
                done();
            });
    });
});

