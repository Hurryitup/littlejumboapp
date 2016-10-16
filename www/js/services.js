angular.module('starter.services', [])

.factory('Events', ['$http', function($http) {
  var events;

  var getEvents = function() {
    return $http.get('/test2.json').success(function(eventData) {}); 
  };
  var storeEvents = function(events_array) {
   events = events_array; 
   console.log("Storing: ", events);
  };

  return { 
    getPromise: getEvents,
    store: storeEvents
  };
}]);
