'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('code').expect;
var describe = lab.describe;
var it = lab.test;
var beforeEach = lab.beforeEach;
var elastic = require('../index.js').elastic;

describe('elastic', function () {
  var ctx;
  beforeEach(function (done) {
    ctx = {};
    done();
  });

  describe('errors', function () {
    it('should require args', function (done) {
      expect(elastic.bind(null, {
        // (none)
      })).to.throw(/required/);
      expect(elastic.bind(null, {
        shortHash: 'abcdef'
      })).to.throw(/required/);
      expect(elastic.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName'
      })).to.throw(/required/);
      expect(elastic.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch'
      })).to.throw(/required/);
      expect(elastic.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch'
      })).to.throw(/required/);
      expect(elastic.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch',
        ownerUsername: 'ownerUsername'
      })).to.throw(/required/);
      expect(elastic.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch',
        ownerUsername: 'ownerUsername',
        masterPod: 'masterPod'
      })).to.throw(/required/);
      expect(elastic({
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch',
        ownerUsername: 'ownerUsername',
        masterPod: 'masterPod',
        userContentDomain: 'userContentDomain'
      })).to.be.a.string();
      done();
    });
  });

  describe('success', function () {
    beforeEach(function (done) {
      ctx.opts = {
        masterPod: false,
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'Branch',
        ownerUsername: 'ownerUsername',
        userContentDomain: 'domain.com'
      };
      done();
    });

    describe('isolated: true', function() {
      describe('isolated container (not master)', function() {
        beforeEach(function (done) {
          ctx.opts.isolated = 'das3h343k12hj3g4';
          ctx.opts.instanceName = 'h32e34--instanceName';
          done();
        });
        it('should create an elastic hostname', function (done) {
          expect(
            elastic(ctx.opts)
          ).to.equal('instancename-staging-ownerusername.domain.com');
          done();
        });
      });
      describe('isolated non-repo container (not master)', function() {
        beforeEach(function (done) {
          ctx.opts.isolated = 'das3h343k12hj3g4';
          ctx.opts.instanceName = 'h32e34--redis';
          delete ctx.opts.branch;
          done();
        });
        it('should create an elastic hostname', function (done) {
          expect(
            elastic(ctx.opts)
          ).to.equal('redis-staging-ownerusername.domain.com');
          done();
        });
      });
      describe('isolation master', function() {
        beforeEach(function (done) {
          ctx.opts.isolated = 'das3h343k12hj3g4';
          ctx.opts.isIsolationGroupMaster = true;
          ctx.opts.instanceName = ctx.opts.branch +'-'+ ctx.opts.instanceName;
          done();
        });
        it('should create an elastic hostname', function (done) {
          expect(
            elastic(ctx.opts)
          ).to.equal('instancename-staging-ownerusername.domain.com');
          done();
        });
      })
    });

    describe('masterPod: true', function() {
      beforeEach(function (done) {
        ctx.opts.masterPod = true;
        done();
      });

      it('should create an elastic hostname', function (done) {
        expect(
          elastic(ctx.opts)
        ).to.equal('instancename-staging-ownerusername.domain.com');

        done();
      });
    });

    describe('masterPod: false', function() {

      describe('valid chars in branch name', function() {
        beforeEach(function (done) {
          // non-master-pod instances have branch in name
          ctx.opts.instanceName = ctx.opts.branch +'-'+ ctx.opts.instanceName;
          done();
        });

        it('should create an elastic hostname', function (done) {
          expect(
            elastic(ctx.opts)
          ).to.equal('instancename-staging-ownerusername.domain.com');
          done();
        });

        describe('wierd mismatch casing', function () {
          beforeEach(function (done) {
            ctx.opts.branch = ctx.opts.branch.toLowerCase();
            done();
          });

          it('should create an elastic hostname', function (done) {
            expect(
              elastic(ctx.opts)
            ).to.equal('instancename-staging-ownerusername.domain.com');
            done();
          });
        });
      });

      describe('invalid characters in branch name', function () {
        beforeEach(function (done) {
          ctx.opts.branch = 'branch/Face';
          var cleanBranch = ctx.opts.branch.replace('/', '-');
          // non-master-pod instances have branch in name
          ctx.opts.instanceName = cleanBranch +'-'+ ctx.opts.instanceName;
          done();
        });

        it('should create an elastic hostname', function (done) {
          expect(
            elastic(ctx.opts)
          ).to.equal('instancename-staging-ownerusername.domain.com');
          done();
        });

        describe('wierd mismatch casing', function () {
          beforeEach(function (done) {
            ctx.opts.branch = ctx.opts.branch.toLowerCase();
            done();
          });

          it('should create an elastic hostname', function (done) {
            expect(
              elastic(ctx.opts)
            ).to.equal('instancename-staging-ownerusername.domain.com');
            done();
          });
        });
      });
    });
  });
});