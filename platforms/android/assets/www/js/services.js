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
  var events;  // list of events corrosponding to current date
  var dates;   // list of possible dates
  var currDateID;
  var currDate;
  return {
    get: function (date, callback) {
      currDateID = date.event_id;
      currDate = date;
      if (events && events.date_id == currDateID) {
        callback(events);
      } else {
        $http.get(currDateID +'.json').success(function(d) {
          events = d;
          events.date_id = currDateID;
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
    },
    getCurrDate: function() {
      console.log("getting Curr Date");
      return currDate;
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
