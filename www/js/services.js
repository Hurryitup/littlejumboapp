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
  var data_url = "https://jumbodaysbackoffice.herokuapp.com/api/";
  var events;     // list of events corresponding to current date
  var dates;      // complete dates + events within them
  var currDateID; // ID of date object
  var currDate;   // Currently selected date object
  
  function enrich_lat_long(event) {
    latlong = event["location"].split(",");
    event["lat"] = parseFloat(latlong[0]);
    event["lng"] = parseFloat(latlong[1]);
  }

  function conditionally_add_am_pm(event, start_or_end) {
    time_string_arr = event[start_or_end].split(":");
    parsed_hour = parseInt(time_string_arr[0]);
    if (parsed_hour >= 12) {
      if (parsed_hour != 12) {
        event[start_or_end + "_time"] = (time_string_arr[0] - 12) + ":" + time_string_arr[1];
      }
      else {
        event[start_or_end + "_time"] = time_string_arr[0] + ":" + time_string_arr[1];
      }
        event[start_or_end + "_time"] = event[start_or_end + "_time"] + "pm";
    }
    else {
      event[start_or_end + "_time"] = time_string_arr[0] + ":" + time_string_arr[1] + "am";
    }
  }

  function enrich_event_times(event) {
    conditionally_add_am_pm(event, "start");
    conditionally_add_am_pm(event, "end");
  }

  function enrich(date) {
    for (var i = 0; i < date["events"].length; i++) {
      event = (date["events"])[i];
      // format time for front end
      enrich_event_times(event);

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
      a_split = (a["start"]).split(":");
      b_split = (b["start"]).split(":");
      hours_diff = parseInt(a_split[0]) - parseInt(b_split[0]);
      if (hours_diff != 0) {
        return hours_diff;
      }
      else {
        return parseInt(a_split[1]) - parseInt(b_split[1]);
      }
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
        d.toggled = false;
      });
    }
  };
}])

/*
 * Favorites factory
 */
.factory('Favorites', function() {
  var favorites = [];

  function makeParedEvent (event) {
    return {
      "name" : event.name,
      "address" : event.address,
      "coordinator": event.coordinator,
      "type": event.type,
      "lat": event.lat,
      "lng": event.lng,
      "description": event.description
    };
  }

  function event_equals(e1, e2) {
    return e1.name === e2.name 
           && e1.address === e2.address
           && e1.coordinator === e2.coordinator
           && e1.type === e2.type
           && e1.lat === e2.lat
           && e1.lng === e2.lng
           && e1.description === e2.description;
  }

  function has (favorites, event) {
    for (i in favorites) {
      if (event_equals(favorites[i], event)) {
        return true;
      }
    }
    return false;
  }

  function add (favorites, event) {
    if (has(favorites, event)) {
      return;
    }
    else {
      favorites.push(event);
    }
  }

  function delete_favorite(favorites, event) {
    for (var i = favorites.length - 1; i >= 0; i--) {
      if(event_equals(favorites[i], event)) {
        favorites.splice(i, 1);
        return;
      }
    };
  }

  // remove later
  window.localStorage.clear();
  //

  var currentVisitingDay;

  return {
    get: function(requestedDay) {
      console.log("in get");
      currentVisitingDay = requestedDay
      if (window.localStorage.getItem(currentVisitingDay)) {
        favorites = JSON.parse(window.localStorage.getItem(currentVisitingDay));
        console.log("favs existed");
      }
      else {
        console.log("favs didn't exist");
        favorites = [];
      }
      return favorites;
    },

    add: function(event) {
      var event_to_add = makeParedEvent(event);
      console.log("in add");
      if (currentVisitingDay == event.visiting_day) {
        console.log("in currentVisitingDay");
        console.log("adding to favs set");
        console.log(favorites);
        // console.log(favorites.delete_favorite(event)  );
        if (window.localStorage.getItem(event.visiting_day)) {
          console.log("favs existed");
          favorites = JSON.parse(window.localStorage.getItem(event.visiting_day));
        }
        else {
          console.log("favs didn't exist");
          favorites = [];
        }
        console.log(has(favorites, event_to_add));
        add(favorites, event_to_add);
      }
      else {
        if (window.localStorage.getItem(event.visiting_day)) {
          console.log("favs existed");
          favorites = JSON.parse(window.localStorage.getItem(event.visiting_day));
        }
        else {
          console.log("favs didn't exist");
          favorites = []
        }
        add(favorites, event_to_add);
        currentVisitingDay = event.visiting_day;
      }
      window.localStorage.setItem(currentVisitingDay, JSON.stringify(favorites));
      return true;
    },

    remove: function(event) {
      var event_to_remove = makeParedEvent(event);
      if (currentVisitingDay == event.visiting_day) {
        delete_favorite(favorites, event_to_remove);
        window.localStorage.setItem(currentVisitingDay, JSON.stringify([...favorites]));
      }
      else {
        if (window.localStorage.getItem(event.visiting_day)) {
          favorites = JSON.parse(window.localStorage.getItem(event.visiting_day));
          delete_favorite(favorites, event_to_remove);
          window.localStorage.setItem(currentVisitingDay, JSON.stringify(favorites));
        }
      }
      currentVisitingDay = event.visiting_day;
      return true;
    },

    has: function(event) {
      var event_to_check = makeParedEvent(event);
      console.log("in has");
      if (currentVisitingDay == event.visiting_day) {
        console.log("on currentVisitingDay");
        if (window.localStorage.getItem(currentVisitingDay)) {
          console.log("favs existed");
          favorites = JSON.parse(window.localStorage.getItem(currentVisitingDay));
        }
        else {
          console.log("favs didn't exist");
          console.log("---------------");
          return false;
        }
      }
      else {
        currentVisitingDay = event.visiting_day;
        console.log("changed currentVisitingDay")
        if (window.localStorage.getItem(event.visiting_day)) {
          console.log("favs existed")
          favorites = JSON.parse(window.localStorage.getItem(event.visiting_day));
        }
        else {
          console.log("favs didn't exist");
          console.log("---------------");
          return false;
        }
      }
      console.log(favorites);
      console.log(has(favorites, event_to_check));
      console.log("---------------");
      return has(favorites, event_to_check);
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
