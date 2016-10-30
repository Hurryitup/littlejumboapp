angular.module('starter.services', [])

.service('User', function (){
  return {};
})

.factory('location', function(){
    var location = {};

    return {
        setProperty: function(latitude, longitude){
        location.lat = latitude;
        location.lng = longitude;
    },
        getProperty: function(){
        return location;
        }
    };
})

.factory('Events', ['$http', function($http) {
  var data;
  return {
    get: function (callback) {
      console.log("Running Get");
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
}])
  
.factory('Favorites', function() {
  var favorites = new Set();

  return {
    get: function() {
      return favorites;
    },
    add: function(event) {
      favorites.add(event);
      return true;
    },
    remove: function(event) {
      favorites.delete(event);
      return true;
    },
    has: function(event) {
      return favorites.has(event);
    }
  }
});
