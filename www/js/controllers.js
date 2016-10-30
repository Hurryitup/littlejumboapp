angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $state, location /*, $cordovaGeolocation */) {
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    var latLng = new google.maps.LatLng(42.4075, -71.1190);
 
    var mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    $scope.makeMarker = function() {
      console.log("hello");
      //alertPopup.close();
      var loc = location.getProperty();
      console.log("the lat is " + loc.lat);   //currently undefined
      var newLatLng;
      //hard coded vals to see if makeMarker works -> it does!
      newLatLng = new google.maps.LatLng(42.4066456, -71.1192478);//loc.lat, loc.lng);
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: newLatLng
      });      
     
      var infoWindow = new google.maps.InfoWindow({
          content: "yo"
      });
     
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
    }
    $scope.makeMarker();
})

.controller('EventsCtrl',
            ['$scope', '$ionicPopup', '$ionicScrollDelegate', 'Events', 'Favorites', 'location',
             function($scope, $ionicPopup, $ionicScrollDelegate, Events, Favorites, location) {

  // Makes http request if data is not already downloaded
  Events.get(function(data) {
      $scope.events = data;
      // console.log('$scope.events: %o', $scope.events);    
  });

  // Make dynamic accordian list
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    if ($scope.shownGroup === group && $scope.shownGroup.subevents) {
  return true;
    }
  };

  // On star click - change in data and html
  $scope.toggleFavorite = function(event, event_id) {
    html_id = "fav_icon_" + event_id;
    // console.log(html_id);
    // console.log(document);
    if (Favorites.has(event)) {
      document.getElementById(html_id).className = "icon ion-android-star-outline icon-accessory";
      Favorites.remove(event);
    } else {
      document.getElementById(html_id).className = "icon ion-android-star icon-accessory";
      Favorites.add(event);
    }
    // console.log("FAVING: ", event);
    // console.log(Favorites.get());
  }

  // Display event info pop-up
  $scope.showAlert = function(event) {
    // $ionicScrollDelegate.$getByHandle(event.id.toString()).scrollTop(); ***NOT WORKING***
       if (event.type == 'composite') 
         return;
       console.log("trying to create alert popup"); 
       // when calling ng-click should be calling it on something like event.subevents[0].lat/.lng
       // but setProperty never gets called! why?
       // location.setProperty(42.4075, 71.1190); when called like this it works!!
       var alertPopup = $ionicPopup.alert({
              title: event.title,
              content: "<a href=\"#/tab/map\" ng-click='location.setProperty("+ 42.4075 + "," + -71.1190 + ")'>" + event.location + "</a><br><br>" + event.description 
      });
  }
}])

// Leftover from demo app - might revert to full screen event details page, so keeping it for now
.controller('EventDetailCtrl', function($scope, $stateParams, Events) {
  // console.log($stateParams.eventId);
  $scope.event = Events.getEvent($stateParams.eventId);
  // console.log($scope.event);
})

// Third page controler - name leftover form demo app, currently favorites list
.controller('FavoritesCtrl', function($scope, Favorites) {
  $scope.$on('$ionicView.enter', function() {
    $scope.favs = Array.from(Favorites.get());
    console.log("GettingFavsList: ", $scope.favs);
  });
});

