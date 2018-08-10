const sample = require('../samples/sample_pull_request_list');

const subscribeHook = (z, bundle) => {
  // `z.console.log()` is similar to `console.log()`.
  z.console.log('SUBSCRIBING TO GITHUB');

  // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
  const config = {
    url: bundle.targetUrl,
    content_type: 'json'
  };

  z.console.log('Created the config object: ', config);

  const events = ['pull_request'];

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const parameters = {
    name: 'web',
    config: config,
    events: events
  };

  const options = {
    url: 'https://api.github.com/repos/mikesol314/zapier-platform-example-app-rest-hooks/hooks',
    method: 'POST',
    body: parameters,
    json: true
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then(response => {
      z.console.log("RESPONSE: ", response);
      z.console.log("RESPONSE CONTENT: ", z.JSON.parse(response.content));
      return z.JSON.parse(response.content);
    });
};

const unsubscribeHook = (z, bundle) => {
  z.console.log('UNSUBSCRIBING FROM GITHUB');

  z.console.log('BUNDLE: ', bundle);

  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.id;

  z.console.log('HOOK ID: ', hookId);

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `https://api.github.com/repos/mikesol314/zapier-platform-example-app-rest-hooks/hooks/${hookId}`,
    method: 'DELETE'
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options);
};

const getPullRequest = (z, bundle) => {
  z.console.log("IN TRIGGER NEW PULL REQUEST HOOK");
  z.console.log("CLEANED REQUEST: ", bundle.cleanedRequest);

  // The first time you register the webhook this method is called with other data that we can ignore
  if (bundle.cleanedRequest.pull_request == undefined) {
    z.console.log("Received an event without a pull request. Aborting");
    return []
  }

  z.console.log("PULL REQUEST: ", bundle.cleanedRequest.pull_request);

  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
  const pullRequest = {
    id: bundle.cleanedRequest.pull_request.id,
    title: bundle.cleanedRequest.pull_request.title
  };

  z.console.log("BUILT PULL REQUEST:", pullRequest);

  return [pullRequest];
};

const getFallbackRealPullRequest = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  z.console.log('In list pull requests');

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const parameters = {
    url: 'http://api.github.com/repos/mikesol314/zapier-platform-example-app-github/pulls',
    method: 'GET'
  };

  const response = z.request(parameters);
  // You may return a promise or a normal data structure from any perform method.
  return response
    .then((response) => JSON.parse(response.content));
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'new_pull_request',
  noun: 'Pull Request Status Changed',

  display: {
    label: 'Pull Request Status Changed',
    description: 'Triggers when any pull request changes status.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [

    ],

    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getPullRequest,
    performList: getFallbackRealPullRequest,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: sample,

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'title', label: 'Title'},
    ]
  }
};
