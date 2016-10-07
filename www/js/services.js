angular.module('starter.services', [])

.factory('Events', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var events = [{
    id: 0,
    name: 'Orientation',
    lastText: 'Join us for breakfast!',
    time: '12:00-1:00',
    location: 'Halligan',
  }, {
    id: 1,
    name: 'Attend a class (Session 1)',
    lastText: 'Choose one class to attend.',
    time: '1:00-2:00',
    location: 'Dowling Hall',
    events: [{name: 'History'}, {name: 'English'}, {name: 'Chinese'}]
  }, {
    id: 2,
    name: 'Attend a class (Session 2)',
    lastText: 'Choose one class to attend.',
    time: '2:00-3:00',
    location: '',
    events: [{name: 'History'}, {name: 'English'}, {name: 'Chinese'}]
  }, {
    id: 3,
    name: 'Attend a class (Session 3)',
    lastText: 'Choose one class to attend.',
    time: '3:00-4:00',
    location: '',
    events: [{name: 'History'}, {name: 'English'}, {name: 'Chinese'}]
  }, {
    id: 4,
    name: 'Attend a class (Session 3.2)',
    lastText: 'Choose one class to attend.',
    time: '4:00-5:00',
    location: '',
    events: [{name: 'History'}, {name: 'English'}, {name: 'Chinese'}]
  }];

  return {
    all: function() {
      return events;
    },
    remove: function(event) {
      events.splice(events.indexOf(event), 1);
    },
    get: function(eventId) {
      for (var i = 0; i < events.length; i++) {
        if (events[i].id === parseInt(eventId)) {
          return events[i];
        }
      }
      return null;
    }
  };
});
