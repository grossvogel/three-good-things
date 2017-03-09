const moment = require('moment-timezone')

module.exports = {
  extract,
  today,
  stringify,
  niceFormat,
  nextDay,
  previousDay,
  getTimezone,
  formatHour,
  getHourInTimezone,
  getDateInTimezone
}

const DAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')

function extract (date, local) {
  if (!date) return null

  try {
    let [ year, month, day ] = date.split('-')
    return local
      ? new Date(year, month - 1, day)
      : new Date(Date.UTC(year, month - 1, day))
  } catch (err) {
    return null
  }
}

function today () {
  var now = new Date()
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
}

function stringify (date) {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join('-')
}

function niceFormat (date) {
  return DAYS[date.getDay()] + ' ' + [
    date.getMonth() + 1, date.getDate()
  ].join('/')
}

function nextDay (date) {
  var next = new Date(date.valueOf())
  next.setDate(date.getDate() + 1)
  return next
}

function previousDay (date) {
  var prev = new Date(date.valueOf())
  prev.setDate(date.getDate() - 1)
  return prev
}

function getTimezone () {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || moment.tz.guess()
}

function formatHour (intHour) {
  if (intHour === 0) {
    return '12 AM'
  } else if (intHour > 12) {
    return '' + (intHour - 12) + ' PM'
  } else {
    return intHour + ' AM'
  }
}

function getHourInTimezone (date, timezone) {
  return parseInt(applyDateFormat(date, {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false
  }))
}

function getDateInTimezone (date, timezone) {
  var localDate = applyDateFormat(date, {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
  let [ month, day, year ] = localDate.split('/')
  return new Date(Date.UTC(year, month - 1, day))
}

//  private helpers

function applyDateFormat (date, options) {
  var formatter = new Intl.DateTimeFormat(['en-us'], options)
  return formatter.format(date)
}

