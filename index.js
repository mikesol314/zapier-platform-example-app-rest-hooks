const PullrequestupdateTrigger = require('./triggers/pull_request_update');
const repoTrigger = require('./triggers/repo');
const issueCreate = require('./creates/issue');
const issueTrigger = require('./triggers/issue');
const recipe = require('./triggers/recipe');
const authentication = require('./authentication');

const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
  return response;
};

// Now we can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  beforeRequest: [
  ],

  afterResponse: [
    handleHTTPError
  ],

  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [PullrequestupdateTrigger.key]: PullrequestupdateTrigger,
    [issueTrigger.key]: issueTrigger,
    [repoTrigger.key]: repoTrigger,
    [recipe.key]: recipe
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [issueCreate.key]: issueCreate,
  }
};

// Finally, export the app.
module.exports = App;
