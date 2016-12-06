angular.module('starter.services', [])

.service('User', function (){
  return {};
})

.factory('location', function(){
    var location = {};

    return {
        setProperty: function(latitude, longitude, building, wasCalled, address){
        location.lat = latitude;
        location.lng = longitude;
        location.building = building;
        location.wasCalled = wasCalled;
        location.address = address;
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
      if (data) {
      	callback(data);
      } else {

      	$http.get('test.json').success(function(d) {
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
})

.factory('Documents', ['$http', function($http) {
  var docs;
  return {
    get: function (callback) {
      if (docs) {
        callback(docs);
      } else {

        $http.get('documents.json').success(function(d) {
          callback(d);
        });
      }
    },
    getDocument: function(id) {
      if (docs) {
        return docs[id - 1];
      }
    }
  };
}])