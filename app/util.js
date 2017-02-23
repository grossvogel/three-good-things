module.exports.parseEndpointAndId = function parseEndpointAndId(subscriptionInfo) {
  var endpoint = subscriptionInfo.endpoint;
  var subscriptionId = subscriptionInfo.subscriptionId;
  
  //  handle some different formats of GCM endpoints to make sure we
  //  always have the subscriptionId in the endpoint, and as its own value
  if (subscriptionId && endpoint.indexOf(subscriptionId) === -1) {
    endpoint += '/' + subscriptionId;
  }
  if (!subscriptionId) {
    var pieces = endpoint.split('/');
    subscriptionId = pieces[pieces.length - 1];
  }
  return { endpoint: endpoint, subscriptionId: subscriptionId };
};
