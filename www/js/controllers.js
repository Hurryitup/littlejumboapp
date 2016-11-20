angular.module('starter.controllers', ['ngCordova'])

.controller('MapCtrl', function($scope, $state, location, $cordovaGeolocation) {
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    var latLng = new google.maps.LatLng(42.4075, -71.1190);
 
    var posOptions = {
            enableHighAccuracy: true,
            timeout: 100000,
            maximumAge: 0
    };
    var mapOptions = {
            center: latLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };          
         
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);         
        $scope.map = map;
 
   var userMarker;
   var infoWindow = new google.maps.InfoWindow();
   var userLatLng;

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var userlat  = position.coords.latitude;
        var userlong = position.coords.longitude;
         
        userLatLng = new google.maps.LatLng(userlat, userlong);
                  
        $scope.makeUserMarker(userLatLng);
        google.maps.event.addListener(map, 'click', function() {
          infowindow.close();
        });    
      }, function(err) {
          console.log(err);
      });

    $scope.makeUserMarker = function(userLatLng) {
      //userMarker.setMap();
      userMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: userLatLng,
        icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
      });      
          
      google.maps.event.addListener(userMarker, 'click', function () {
          infoWindow.setContent('<div id="iw-container">"You are here!"</div>');   
          infoWindow.open($scope.map, userMarker);
      });


    }
 
    
    //$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    var loc = location.getProperty();
    var marker;
    $scope.makeMarker = function() {
      console.log("inside make marker");
      infoWindow.close();
      if(marker != null)
        marker.setMap(null);
      var newLatLng;
      newLatLng = new google.maps.LatLng(loc.lat, loc.lng);
      marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: newLatLng
      });      
        
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.setContent("<strong>"+loc.building+"</strong></br>"+loc.address);
          infoWindow.open($scope.map, marker);
      });
      loc.wasCalled = false;
      $scope.map.setCenter(newLatLng);
    }

    $scope.$on('$ionicView.enter', function(){
      if (loc.wasCalled == true) {
        $scope.makeMarker();
      }
      $scope.makeUserMarker();
    });
})

.controller('EventsCtrl',
            ['$scope', '$state', '$ionicPopup', '$ionicScrollDelegate', 'Events', 'Favorites', 'location',
             function($scope, $state, $ionicPopup, $ionicScrollDelegate, Events, Favorites, location) {

  // Makes http request if data is not already downloaded
  Events.get(function(data) {
      $scope.events = data;
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
    if (Favorites.has(event)) {
      document.getElementById(html_id).className = "icon ion-android-star-outline icon-accessory star";
      Favorites.remove(event);
    } else {
      document.getElementById(html_id).className = "icon ion-android-star icon-accessory star";
      Favorites.add(event);
    }
  }
  var alertPopup;
  // Display event info pop-up
  $scope.showAlert = function(event) {
    // $ionicScrollDelegate.$getByHandle(event.id.toString()).scrollTop(); ***NOT WORKING***
       if (event.type == 'composite') 
         return;
       // when calling ng-click should be calling it on something like event.subevents[0].lat/.lng
       // but setProperty never gets called! why?
       //"<a href=\"#/tab/map\" ng-click=''>"
       //location.setProperty(event.lat, event.lng, event.location, true);
       console.log(event.lat);
       alertPopup = $ionicPopup.alert({
              title: event.title,
              scope: $scope,
              content: "<button class=\"goToMap\" ng-click='goToMap(" + event.lat + "," + event.lng + ", \"" + event.location + "\", \"" + event.address + "\")'>" + event.location + "</button><br><br>" + event.description 
      });
  }

  $scope.goToMap = function(lat, lng, building, address) {
    console.log(address);
      alertPopup.close();
      location.setProperty(lat, lng, building, true, address);
      $state.go("tab.map");

  }

}])

// Leftover from demo app - might revert to full screen event details page, so keeping it for now
.controller('EventDetailCtrl', function($scope, $stateParams, Events) {
  $scope.event = Events.getEvent($stateParams.eventId);
})

// Third page controler - name leftover form demo app, currently favorites list
.controller('FavoritesCtrl', function($scope, Favorites) {
  $scope.$on('$ionicView.enter', function() {
    $scope.favs = Array.from(Favorites.get());
  });
});

