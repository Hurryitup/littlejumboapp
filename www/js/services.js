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

  function enrich_shownTime(event, dayDiff) {
    var now = new Date();
    time_string_arr = event["start"].split(":");
    parsed_hour = parseInt(time_string_arr[0]);
    var hours_diff = parsed_hour - now.getHours();
    if (dayDiff == 0) {
      //Today
      if (hours_diff < 0) {
      event["shownTime"] = "Already Started";
      } else if (hours_diff <= 2) {
        event["shownTime"] = "Starting Soon";
      } else {
        event["shownTime"] = "Today";
      }
    } else if (dayDiff == 1) {
      event["shownTime"] = "Tomorrow";
    } else if (dayDiff < 0) {
      event["shownTime"] = (-1*dayDiff).toString() + " days ago";
    } else {
      event["shownTime"] = "In " + dayDiff.toString() + " days";
    }
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
    var today = new Date();
    var day = new Date(Date.parse(date.date)); //Sorry
    var dayDiff = Math.ceil((day - today)/(86400000)); //get difference in days
    for (var i = 0; i < date["events"].length; i++) {
      event = (date["events"])[i];
      // format time for front end
      enrich_event_times(event);
      enrich_shownTime(event, dayDiff);

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
          enrich_shownTime(sub_event, dayDiff);
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
      "description": event.description,
      "visiting_day" : event.visiting_day
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

  function add_favorite (favorites, event) {
    if (has(favorites, event)) {
      return;
    }
    else {
      favorites.push(event);
    }
    window.localStorage.setItem(currentVisitingDay, favorites);
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
      currentVisitingDay = requestedDay;
      console.log(window.localStorage.getItem(currentVisitingDay));
      if (window.localStorage.getItem(currentVisitingDay)) {
        favorites = JSON.parse(window.localStorage.getItem(currentVisitingDay));
        console.log("favs existed");
      }
      else {
        console.log("favs didn't exist");
        favorites = [];
      }
      console.log(favorites);
      return favorites;
    },

    add: function(event) {
      var event_to_add = makeParedEvent(event);
      console.log("in add");
      console.log("favorites: " + favorites);
      console.log(event);
      if (currentVisitingDay != event.visiting_day) {
        console.log("not in currentVisitingDay, saving and changing from " + currentVisitingDay + "to " + event.visiting_day);
        window.localStorage.setItem(currentVisitingDay, favorites)
        currentVisitingDay = event.visiting_day;
      }
      //
      else {
        console.log("already in currentVisitingDay: " + currentVisitingDay);
      }
      //
      if (window.localStorage.getItem(currentVisitingDay)) {
        console.log("persisted favs existed = " + window.localStorage.getItem(currentVisitingDay));
        favorites = JSON.parse(window.localStorage.getItem(currentVisitingDay));
      }
      else {
        console.log("favs didn't exist");
        favorites = [];
      }
      console.log(has(favorites, event_to_add));
      add_favorite(favorites, event_to_add);
      console.log("cvd: " + currentVisitingDay + " favorites: " + JSON.stringify(favorites));
      window.localStorage.setItem(currentVisitingDay, JSON.stringify(favorites));
      console.log("saved favorites, leaving add");
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
      if (currentVisitingDay == event.visiting_day) {
        if (window.localStorage.getItem(currentVisitingDay)) {
          console.log("favs existed");
          favorites = JSON.parse(window.localStorage.getItem(currentVisitingDay));
        }
        else {
          console.log("favs didn't exist");
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
          return false;
        }
      }
      // console.log(favorites);
      // console.log(has(favorites, event_to_check));
      // console.log("---------------");
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
