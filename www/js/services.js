angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Europe to 1815',
    lastText: 'Proctor',
    time: '12:00-1:00',
    location: 'Halligan'
  }, {
    id: 1,
    name: 'Web Programming',
    lastText: 'Ming Chow',
    time: '1:00-2:00',
    location: 'Cousins Gym'
  }, {
    id: 2,
    name: 'Algorithms',
    lastText: 'Greg Aloupis',
    time: '2:00-3:00',
    location: 'Hill Hall'
  }, {
    id: 3,
    name: 'Chinese Philosophy',
    lastText: 'Ning Ma',
    time: '3:00-4:00',
    location: 'Olin'
  }, {
    id: 4,
    name: 'Journey of the Hero',
    lastText: 'M.C.B.',
    time: '4:00-5:00',
    location: 'Halligan'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
