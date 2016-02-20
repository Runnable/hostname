# runnable-hostname
util for generating an instance's elastic or direct hostname

# Usage
```js
var hostname = require('runnable-hostname');

// Non-master Pod Instance

hostname.direct({
  shortHash: 'abcdef',
  // non-masterPod instance has branch in name, so branch is required
  instanceName: 'branch-instanceName',
  branch: 'branch',
  ownerUsername: 'ownerUsername',
  masterPod: false,
  userContentDomain: 'runnableapp.com'
});
// abcdef-instanceName-staging-ownerUsername.runnableapp.com
hostname.elastic({
  shortHash: 'abcdef',
  instanceName: 'branch-instanceName',
  branch: 'branch',
  ownerUsername: 'ownerUsername',
  masterPod: false,
  userContentDomain: 'runnableapp.com'
});
// instanceName-staging-ownerUsername.runnableapp.com

// Master Pod Instance

hostname.direct({
  shortHash: 'abcdef',
  // masterPod instance has does NOT have branch in name, so branch is not required
  instanceName: 'instanceName',
  ownerUsername: 'ownerUsername',
  masterPod: true,
  userContentDomain: 'runnableapp.com'
});
// abcdef-instanceName-staging-ownerUsername.runnableapp.com
hostname.elastic({
  shortHash: 'abcdef',
  instanceName: 'instanceName',
  ownerUsername: 'ownerUsername',
  masterPod: true,
  userContentDomain: 'runnableapp.com'
});
// instanceName-staging-ownerUsername.runnableapp.com
```
