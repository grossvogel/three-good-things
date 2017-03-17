module.exports = {
  post,
  get,
  request,
  upload
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

function upload (endpoint, data, filename, fieldName) {
  fieldName = fieldName || 'upload'
  let formData = new window.FormData()
  formData.append(fieldName, data, filename)
  return request(endpoint, 'post', {
    body: formData
  })
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

