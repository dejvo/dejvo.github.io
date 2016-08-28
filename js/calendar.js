var API_KEY = 'AIzaSyC5BoTUmLuQRDLoYJqEr02XvhrSF71aMvk';
var CALENDAR_ID = '31en7fnc5fqhn206hi2brq1tjc@group.calendar.google.com';

$(document).ready(function() {
    $('#calendar').fullCalendar({
        googleCalendarApiKey: API_KEY,
        lang: 'sk',
        events: {
            googleCalendarId: CALENDAR_ID,
        },
        eventRender: function(calEvent, element) {
          $(element).attr('role', 'button');
          $(element).attr('tabindex', '0');
          $(element).attr('data-toggle', 'popover');
        },
        eventAfterRender: function(calEvent, element) {
          var title = '<strong>' + calEvent.title + '</strong>';
          if (!calEvent.allDay) {
            title += '<div class="time">' + calEvent.start.format('LT') + ' -  ' + calEvent.end.format('LT') + '</div>';
          }
          $(element).popover({
            title: title,
            content: calEvent.description,
            container: 'body',
            placement: 'top',
            trigger: 'focus',
            html: true
          });
        },
        eventClick: function(calEvent, jsEvent, view) {
          return false;
        }
    });
});
