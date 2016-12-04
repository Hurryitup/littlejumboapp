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
  var events;
  var dates;
  var currDateID;
  return {
    get: function (date_id, callback) {
      currDateID = date_id;
      if (events && events.date_id == date_id) {
        callback(events);
      } else {
        $http.get(date_id +'.json').success(function(d) {
          events = d;
          events.date_id = date_id;
          callback(events);
        });
      }
    },
    getDates: function(callback) {
      if (dates) {
        return dates;
      } else {
        $http.get('dates.json').success(function(d) {
          dates = d;
          callback(d);
        })
      }
    },
    getCurrDateID: function() {
      return currDateID;
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
