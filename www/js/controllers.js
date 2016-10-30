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
    
    var loc = location.getProperty();
    $scope.makeMarker = function() {
      console.log("hello");
      console.log("the lat is " + loc.lat);   //currently undefined
      var newLatLng;
      newLatLng = new google.maps.LatLng(loc.lat, loc.lng);
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: newLatLng
      });      
     
      var infoWindow = new google.maps.InfoWindow({
          content: loc.building
      });
     
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
      loc.wasCalled = false;
    }
    if (loc.wasCalled == true) {
      $scope.makeMarker();
    }
})

.controller('EventsCtrl',
            ['$scope', '$state', '$ionicPopup', '$ionicScrollDelegate', 'Events', 'Favorites', 'location',
             function($scope, $state, $ionicPopup, $ionicScrollDelegate, Events, Favorites, location) {

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
  var alertPopup;
  // Display event info pop-up
  $scope.showAlert = function(event) {
    // $ionicScrollDelegate.$getByHandle(event.id.toString()).scrollTop(); ***NOT WORKING***
       if (event.type == 'composite') 
         return;
       console.log("trying to create alert popup"); 
       // when calling ng-click should be calling it on something like event.subevents[0].lat/.lng
       // but setProperty never gets called! why?
       //"<a href=\"#/tab/map\" ng-click=''>"
       //location.setProperty(event.lat, event.lng, event.location, true);
       console.log(event.lat);
       alertPopup = $ionicPopup.alert({
              title: event.title,
              scope: $scope,
              content: "<button ng-click='goToMap(" + event.lat + "," + event.lng + ")'>" + event.location + "</button><br><br>" + event.description 
      });
  }

  $scope.goToMap = function(lat, lng) {
    console.log("inside goToMap");
      alertPopup.close();
      location.setProperty(lat, lng, "", true);
      $state.go("tab.map");
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

