var API_KEY = 'AIzaSyC5BoTUmLuQRDLoYJqEr02XvhrSF71aMvk';
var CALENDAR_ID = '31en7fnc5fqhn206hi2brq1tjc@group.calendar.google.com';

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
 $(window).load(function() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
});

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': CALENDAR_ID,
    'key': API_KEY,
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    var dateFormatted;
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        dateFormatted = new Date(when);
        dateFormatted = dateFormatted.getDate() + '.' + (dateFormatted.getMonth() + 1) + '.'  + dateFormatted.getFullYear();
        var newDiv = document.createElement('div');
        var dateElem = document.createElement('strong');
        dateElem.appendChild(document.createTextNode(dateFormatted));
        var summarySpan = document.createElement('span');
        summarySpan.appendChild(document.createTextNode(event.summary));
        // appendPre(dateFormatted + ' - ' + event.summary);
        newDiv.appendChild(dateElem);
        newDiv.appendChild(summarySpan);
        // appendPre(newDiv);
        $('#output').append('<div><div class="calendar-date">' + dateFormatted + '</div><span>' + event.summary + '</span></div>');
      }
    } else {
      appendPre('No upcoming events found.');
    }

  });
};

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  // var textContent = document.createTextNode(message + '\n');
  pre.appendChild(message);
}

$(document).ready(function() {
    $('#calendar').fullCalendar({
        googleCalendarApiKey: API_KEY,
        lang: 'sk',
        events: {
            googleCalendarId: CALENDAR_ID,
        },
        eventClick: function(calEvent, jsEvent, view) {
          console.log(calEvent);
          console.log(jsEvent);
          console.log(view);
          return false;
        }
    });
});