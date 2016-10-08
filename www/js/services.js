angular.module('starter.services', [])

.factory('Events', ['$http', function($http) {
  return { 
    get: function() {
      return $http.get('/test2.json').success(function(eventData) {}); 
    }
  }
}]);
