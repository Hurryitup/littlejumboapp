angular.module('starter.services', [])

.factory('Events', ['$http', function($http) {
  var data;
  return {
    get: function (callback) {
      if (data) {
	callback(data);
      } else {
	console.log("HTTP_RQ");
	$http.get('test2.json').success(function(d) {
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
}]);
