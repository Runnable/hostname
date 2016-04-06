'use strict';

var exists = require('101/exists');
var createHostLabel = require('./create-host-label.js');
var replaceInvalid = require('./replace-invalid.js');
var regexForIsolationPrefix = /^[A-z0-9]*--/;

module.exports = {
  elastic: elastic,
  direct:  direct
};

/**
 * Returns true if the instance is isolated, but is not the isolation master
 * @param opts
 */
function isIsolatedContainer (opts) {
  return opts.isolated && !opts.isIsolationGroupMaster
}

function elastic (opts) {
  validateOpts(opts);
  // consistency btw direct and elastic
  // If the instance is isolated,
  var replacement = isIsolatedContainer(opts) ? regexForIsolationPrefix : opts.shortHash + '-';
  return direct(opts).replace(replacement, '').toLowerCase();
}

function direct (opts) {
  validateOpts(opts);
  var template = '{shortHash}-{repoName}-{env}-{ownerUsername}'
    .replace('{shortHash}-', isIsolatedContainer(opts) ? '' : opts.shortHash + '-')
    .replace('{env}', 'staging');
  var subdomain = createHostLabel(template, [
    {
      key: 'ownerUsername',
      val: opts.ownerUsername,
      max: 39 // maxlength of username in github is 39
    },
    {
      key: 'repoName',
      val: getRepoName(opts)
    }
  ]);
  return (subdomain+'.'+opts.userContentDomain).toLowerCase();
}

function validateOpts (opts) {
  requireOpt(opts, 'shortHash');
  requireOpt(opts, 'instanceName');
  requireOpt(opts, 'ownerUsername');
  requireOpt(opts, 'masterPod');
  requireOpt(opts, 'userContentDomain');
}

function requireOpt (opts, key) {
  if (!exists(opts[key])) {
    throw new Error('opts.'+key+' is required');
  }
}

function getRepoName (opts) {
  var instanceName = opts.instanceName;
  if (opts.masterPod || (opts.isolated && !opts.branch)) {
    // isolated non-repo containers are not masterpods, but should create their reponames the same
    return instanceName;
  }
  requireOpt(opts, 'branch');
  var branch = replaceInvalid(opts.branch);
  if (!~instanceName.indexOf(branch)) {
    // fallback: we tried to maintain case but a branch
    // match was not found so we must now lowerCase both
    // as a last resort;
    instanceName = instanceName.toLowerCase();
    branch = branch.toLowerCase();
  }
  return instanceName.replace(branch+'-', '');
}