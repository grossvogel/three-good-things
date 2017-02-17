module.exports.post = function post(endpoint, data) {
  return fetch(endpoint, getOptions({
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }));
};

module.exports.get = function get(endpoint) {
  return fetch(endpoint, getOptions({
    method: 'get'
  }));
};

const defaults = {
  method: 'post',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'X-CSRF-Token': document.getElementById('csrf').value
  }
};

function getOptions(overrides) {
  var options = Object.assign({}, defaults, overrides);
  options.headers = new Headers(
    Object.assign({}, defaults.headers, overrides.headers)
  );
  return options;
}


