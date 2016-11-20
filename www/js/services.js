angular.module('starter.services', [])

.service('User', function (){
  return {};
})

.factory('location', function(){
    var location = {};

    return {      //this never gets called?!
        setProperty: function(latitude, longitude, building, wasCalled, address){
        console.log("We in setProperty! and lat is:" + latitude);
        location.lat = latitude;
        location.lng = longitude;
        location.building = building;
        location.wasCalled = wasCalled;
        location.address = address;
        },
        getProperty: function(){
        console.log("In getProperty! and lat is" + location.lat);
        return location;
        }
    };
})

.factory('Events', ['$http', function($http) {
  var data;
  return {
    get: function (callback) {
      if (data) {
      	callback(data);
      } else {
	console.log("HTTP_RQ");

      	$http.get('test2.json').success(function(d) {
      	  callback(d);
      	});
      }
    },
    getEvent: function(id) {
      if (data) {
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
