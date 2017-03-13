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
  var data_url = "http://localhost:8000/api/";
  var events;     // list of events corresponding to current date
  var dates;      // complete dates + events within them
  var currDateID; // ID of date object
  var currDate;   // Currently selected date object
  
  function enrich_lat_long(event) {
    latlong = event["location"].split(",");
    event["lat"] = parseFloat(latlong[0]);
    event["lng"] = parseFloat(latlong[1]);
  }

  function enrich(date) {
    for (var i = 0; i < date["events"].length; i++) {
      event = (date["events"])[i];
      // change dateTimes to strings for frontend
      start_datetime = new Date(event["start"]);
      end_datetime = new Date(event["end"]);
      event["start_time"] = start_datetime.getHours() + ":" + start_datetime.getMinutes();
      event["end_time"] = end_datetime.getHours() + ":" + end_datetime.getMinutes();

      // populate 'type' field
      if (event["sub_events"]) {
        event["type"] = "composite";
      }
      else {
        event["type"] = "standalone";
      }

      // unpack 'location' into lat and long
      if (event["type"] == "standalone"){
        enrich_lat_long(event);
      }
      else {
        nested = event["sub_events"];
        nested.forEach(function (sub_event) {
          enrich_lat_long(sub_event);
        });
      }
    }
    return date;
  }

  function make_flat_events_list (date) {
    standalone = date.standalone_events;
    composite_events = date.composite_events;
    flattened = standalone.concat(composite_events);
    flattened.sort(function(a,b) {
      console.log(b["name"]);
      console.log(new Date(Date.parse(b["start"])));
      return new Date(b["start"]) - new Date(a["start"]);
    });
    date.events = flattened;
  }

  return {
    // date object, callback
    get: function (date, callback) {
      events = date.events;
      events.date_id = date.pk
      currDateID = date.pk;
      currDate = date;
      currDate.toggled = true;
      if (events && events.date_id == currDateID) {
        callback(events);
      }
      else {
        console.log("something went wrong with events");
      }
    },

    // Downloads and returns list of possible dates
    getDates: function(callback) {
      if (dates) {
        callback(dates);
      } else {
        $http.get(data_url + "visiting_days/").success(function(d) {
          dates = []
          for (var i = 0; i < d.length; i++) {
            make_flat_events_list(d[i]);
            dates = dates.concat(enrich(d[i]));
          }
          callback(dates);
        })
      }
    },

    getCurrDateID: function() {
      return currDateID;
    },

    getCurrDate: function() {
      return currDate;
    },

    deactivateAllDates: function(date) {
      dates.forEach(function(d) {
        console.log(d)
        d.toggled = false;
      });
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
