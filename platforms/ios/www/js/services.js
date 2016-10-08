angular.module('starter.services', [])

.factory('Events', ['$http', function($http) {
  return { 
    get: function() {
      return $http.get('http://45.55.189.20/test2.min.json').success(function(eventData) {}); 
    }
  }
}]);
