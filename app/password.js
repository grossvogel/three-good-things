const crypto = require('crypto')

module.exports = {
  hash,
  check
}

function hash (rawPW) {
  return newSalt().then(function (salt) {
    return pbkdf2Hash(rawPW, salt)
  }).then(function (hashInfo) {
    return hashInfo.salt + '#' + hashInfo.hash
  }).catch(function (err) {
    throw err
  })
}

function check (rawPW, saltAndHashedPW) {
  var hashedPW, salt;
  [salt, hashedPW] = saltAndHashedPW.split('#')
  if (!salt || !hashedPW) {
    return Promise.reject(new Error('Hash format not recognized'))
  } else {
    return pbkdf2Hash(rawPW, salt).then(function (hashInfo) {
      return hashInfo.hash === hashedPW
    }).catch(function (err) {
      throw err
    })
  }
}

//  private helpers

function newSalt () {
  return new Promise(function (resolve, reject) {
    crypto.randomBytes(16, function (err, buf) {
      if (err || !buf) {
        reject(err)
      } else {
        resolve(buf.toString('hex'))
      }
    })
  })
}

function pbkdf2Hash (rawPW, salt) {
  var iterations = 10000
  return new Promise(function (resolve, reject) {
    crypto.pbkdf2(rawPW, salt, iterations, 512, 'sha512', function (err, key) {
      if (err || !key) {
        reject(err)
      } else {
        resolve({hash: key.toString('hex'), salt: salt})
      }
    })
  })
}
