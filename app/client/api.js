module.exports = {
  post: post,
  get: get,
  request: request
}

const defaults = {
  method: 'post',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'X-CSRF-Token': document.getElementById('csrf').value
  }
}

function post (endpoint, data) {
  return request(endpoint, 'post', {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function get (endpoint) {
  return request(endpoint)
}

function request (endpoint, method, options) {
  options = options || {}
  options.method = method || 'get'
  return window.fetch(endpoint, getOptions(options)).then(function (response) {
    return response.json()
  })
};

function getOptions (overrides) {
  var options = Object.assign({}, defaults, overrides)
  options.headers = new window.Headers(
    Object.assign({}, defaults.headers, overrides.headers)
  )
  return options
}

