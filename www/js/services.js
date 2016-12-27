angular.module('starter.services', [])

/*
 * User service
 */
.service('User', function (){
  return {};
})

/*
 * Location factory
 */
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

/*
 * Events factory
 */
.factory('Events', ['$http', function($http) {
  var events;     // list of events corrosponding to current date
  var dates;      // list of possible dates
  var currDateID; // ID of date object
  var currDate;   // Currently selected date object
  return {
    // date object, callback
    // Downloads date only when necessesary 
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

    // Downloads and returns list of possible dates
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

/*
 * Favorites factory
 */
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

/*
 * User service
 */
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
    // This probably wont work in production
    getDocument: function(id) {
      if (docs) {
        return docs[id - 1];
      }
    }
  };
}])
