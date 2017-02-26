module.exports.post = function post (endpoint, data) {
  return window.fetch(endpoint, getOptions({
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }))
}

module.exports.get = function get (endpoint) {
  return window.fetch(endpoint, getOptions({
    method: 'get'
  }))
}

module.exports.request = request

function request (endpoint, method, options) {
  options = options || {}
  options.method = method || 'get'
  return window.fetch(endpoint, getOptions(options))
};

const defaults = {
  method: 'post',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'X-CSRF-Token': document.getElementById('csrf').value
  }
}

function getOptions (overrides) {
  var options = Object.assign({}, defaults, overrides)
  options.headers = new window.Headers(
    Object.assign({}, defaults.headers, overrides.headers)
  )
  return options
}

