'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('code').expect;
var describe = lab.describe;
var it = lab.test;
var beforeEach = lab.beforeEach;
var createHostLabel = require('../lib/create-host-label.js');

describe('create host label', function () {
  var ctx;
  beforeEach(function (done) {
    ctx = {};
    done();
  });

  it('should create a host label', function (done) {
    var label = createHostLabel('{shortHash}-{repoName}-staging-{ownerUsername}', [
      {
        key: 'ownerUsername',
        val: 'ownerUsername',
        max: 39 // maxlength of username in github is 39
      },
      {
        key: 'repoName',
        val: 'repoName',
        min: 'repo+Name'.length
      },
      {
        key: 'shortHash',
        val: 'abcdef',
        min: 6
      }
    ]);

    expect(label).to.equal('abcdef-reponame-staging-ownerusername');
    done();
  });

  it('should create a host label and replace any invalid characters', function (done) {
    var label = createHostLabel('{shortHash}-{repoName}-staging-{ownerUsername}', [
      {
        key: 'ownerUsername',
        val: 'owner_Username',
        max: 39 // maxlength of username in github is 39
      },
      {
        key: 'repoName',
        val: 'repo+Name',
        min: 'repoName'.length
      },
      {
        key: 'shortHash',
        val: 'abcdef',
        min: 6
      }
    ]);

    expect(label).to.equal('abcdef-repo-name-staging-owner-username');
    done();
  });
});
