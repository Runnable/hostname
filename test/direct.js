'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('code').expect;
var describe = lab.describe;
var it = lab.test;
var beforeEach = lab.beforeEach;
var direct = require('../index.js').direct;

describe('hostname', function () {
  var ctx;
  beforeEach(function (done) {
    ctx = {};
    done();
  });

  describe('errors', function () {
    it('should require args', function (done) {
      expect(direct.bind(null, {
        // (none)
      })).to.throw(/required/);
      expect(direct.bind(null, {
        shortHash: 'abcdef'
      })).to.throw(/required/);
      expect(direct.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName'
      })).to.throw(/required/);
      expect(direct.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch'
      })).to.throw(/required/);
      expect(direct.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch'
      })).to.throw(/required/);
      expect(direct.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch',
        ownerUsername: 'ownerUsername'
      })).to.throw(/required/);
      expect(direct.bind(null, {
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'branch',
        ownerUsername: 'ownerUsername',
        masterPod: 'masterPod'
      })).to.throw(/required/);
      expect(direct({
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
        shortHash: 'abcdef',
        instanceName: 'instanceName',
        branch: 'Branch',
        ownerUsername: 'ownerUsername',
        userContentDomain: 'domain.com'
      };
      done();
    });

    describe('masterPod: true', function() {
      beforeEach(function (done) {
        ctx.opts.masterPod = true;
        done();
      });

      it('should create an direct hostname', function (done) {
        expect(
          direct(ctx.opts)
        ).to.equal('abcdef-instancename-staging-ownerusername.domain.com');

        done();
      });
    });

    describe('masterPod: false', function() {
      beforeEach(function (done) {
        ctx.opts.masterPod = false;
        // non-master-pod instances have branch in name
        ctx.opts.instanceName = ctx.opts.branch +'-'+ ctx.opts.instanceName;
        done();
      });

      it('should create an direct hostname', function (done) {
        expect(
          direct(ctx.opts)
        ).to.equal('abcdef-instancename-staging-ownerusername.domain.com');
        done();
      });

      describe('wierd mismatch casing', function () {
        beforeEach(function (done) {
          ctx.opts.branch = ctx.opts.branch.toLowerCase();
          done();
        });

        it('should create an direct hostname', function (done) {
          expect(
            direct(ctx.opts)
          ).to.equal('abcdef-instancename-staging-ownerusername.domain.com');
          done();
        });
      });
    });
  });
});