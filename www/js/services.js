angular.module('starter.services', [])

.factory('Events', ['$http', function($http) {
  // var events;

  // var getEvents = function() {
  //   return $http.get('/test2.json').success(function(eventData) {}); 
  // };
  // var storeEvents = function(events_array) {
  //  events = events_array; 
  //  console.log("Storing: ", events);
  // };

  var data;
  return {
    get: function (callback) {
      if (data) {
	callback(data);
      } else {
	console.log("HTTP_RQ");
	$http.get('/test2.json').success(function(d) {
	  callback(data = d);
	});
      }
    },
    getEvent: function(id) {
      if (data) {
        console.log("GETEVENT");
        return data[id - 1];
      }
    }
  };

  // return { 
  //   getPromise: getEvents,
  //   store: storeEvents
  // };
}]);
