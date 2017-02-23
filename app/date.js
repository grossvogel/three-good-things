const DAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');

module.exports.extract = function extract(date, local) {
  if(!date) return null;

  try {
    [ year, month, day] = date.split('-');
    return local
      ? new Date(year, month - 1, day)
      : new Date(Date.UTC(year, month - 1, day));
  } catch(err) {
    return null;
  }
};

module.exports.today = function today() {
  var now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
};

module.exports.stringify = function stringify(date) {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join('-');
};

module.exports.niceFormat = function niceFormat(date) {
  return DAYS[date.getDay()] + ' ' + [
    date.getMonth() + 1, date.getDate()
  ].join('/');
};

module.exports.nextDay = function nextDay(date) {
  var next = new Date(date.valueOf());
  next.setDate(date.getDate() + 1);
  return next;
};

module.exports.previousDay = function previousDay(date) {
  var prev = new Date(date.valueOf());
  prev.setDate(date.getDate() - 1);
  return prev;
};

module.exports.getTimezone = function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

module.exports.formatHour = function formatHour(intHour) {
  if (intHour == 0) {
    return '12 AM';
  } else if (intHour > 12) {
    return '' + (intHour - 12) + ' PM';
  } else {
    return intHour + ' AM';
  }
};

module.exports.getHourInTimezone = function getHourInTimezone(date, timezone) {
  return applyDateFormat(date, {
    timeZone: timezone,
    hour: 'numeric', hour12: false
  });
};

module.exports.getDateInTimezone = function getDateInTimezone(date, timezone) {
  var year, month, day;
  var localDate = applyDateFormat(date, {
    timeZone: timezone,
    year: 'numeric', month: 'numeric', day: 'numeric'
  });
  [ month, day, year ] = localDate.split('/');
  return new Date(Date.UTC(year, month - 1, day));
};

function applyDateFormat(date, options) {
  var formatter = new Intl.DateTimeFormat(['en-us'], options);
  return formatter.format(date);
}

