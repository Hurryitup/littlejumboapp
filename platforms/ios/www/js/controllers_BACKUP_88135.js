angular.module('starter.controllers', ['ngCordova'])

<<<<<<< HEAD
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
   $scope.makeUserMarker = function(userLatLng) {
      userMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: userLatLng
      });      
          
      google.maps.event.addListener(userMarker, 'click', function () {
          infoWindow.setContent('<div class="bubble_content">You are here!</div>');   
          infoWindow.open($scope.map, userMarker);
      });
    }

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var userlat  = position.coords.latitude;
        var userlong = position.coords.longitude;
         
        userLatLng = new google.maps.LatLng(userlat, userlong);
                  
        $scope.makeUserMarker(userLatLng);
        google.maps.event.addListener(map, 'click', function() {
          infoWindow.close();
        });    
      }, function(err) {
          console.log(err);
      });

    $scope.makeUserMarker = function(userLatLng) {
      userMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: userLatLng,
        icon: '/img/bluecircle.png'
      });      
          
      google.maps.event.addListener(userMarker, 'click', function () {
          infoWindow.setContent('<div id="iw-container">"You are here!"</div>');   
          infoWindow.open($scope.map, userMarker);
      });
    }
    
    var loc = location.getProperty();
    var marker;
=======
  /*
   * Map Controller
   *
   */
  .controller('MapCtrl', function($scope, $state, location /*, $cordovaGeolocation */) {
    var options = {timeout: 10000, enableHighAccuracy: true};
    var latLng = new google.maps.LatLng(42.4075, -71.1190);
    var mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
>>>>>>> front_end
    $scope.makeMarker = function() {
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
<<<<<<< HEAD
        
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.setContent("<div class='bubble_content'><strong>"+loc.building+"</strong></br>" + loc.address + "</div>");
          infoWindow.open($scope.map, marker);
=======
      var infoWindow = new google.maps.InfoWindow({
        content: "yo"
      });
      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
>>>>>>> front_end
      });
      loc.wasCalled = false;
      $scope.map.setCenter(newLatLng);
    }
<<<<<<< HEAD

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

  Events.get(function(data) {
      $scope.events = data;
  });

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

  $scope.toggleFavorite = function(event, event_id) {
    html_id = "fav_icon_" + event_id;
    if (Favorites.has(event)) {
      document.getElementById(html_id).className = "icon ion-android-star-outline icon-accessory star";
      Favorites.remove(event);
=======
    $scope.makeMarker();
  })


  /*
   * Events Controller
   *
   */
  .controller('EventsCtrl',
    ['$scope', '$rootScope', '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$ionicPosition', 'Events', 'Favorites', 'location', 
      function($scope, $rootScope, $ionicPopup, $ionicScrollDelegate,  $timeout, $ionicPosition, Events, Favorites, location) {

        // Find first date to fetch if needed and populate list of events
        var dateID = Events.getCurrDateID();
        $scope.date = null;

        if (dateID == null) {
          var dates = Events.getDates();
          $scope.date = dates[0];
          dateID = $scope.date.event_id;
        } else {
          $scope.date = Events.getCurrDate();
        }

        Events.get($scope.date, function(data) {
          $scope.events = data;
          $rootScope.$broadcast('gotEvents');
        });

        // Receive dateChanged event, repopulate event list
        $scope.$on('dateChanged', function(event, date) {
          console.log("felt the click");
          Events.get(date, function(data) {
            $scope.events = data;
            $rootScope.$broadcast('gotEvents');
          });
        });

        $scope.jumptoEvent = function (event) {
          var eventPosition = $ionicPosition.position(angular.element(document.getElementById('item_' + event.id)));
          $ionicScrollDelegate.$getByHandle('scrollview').scrollTo(eventPosition.left, eventPosition.top, true);
        };

        // Make dynamic accordion list
        $scope.toggleGroup = function(group) {
          if (group.type != 'composite') {
            return; 
          } else if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
          } else {
            setTimeout(function () {
              $scope.jumptoEvent(group);
            }, 0170);
            $scope.shownGroup = group;
          }
        };

        $scope.isGroupShown = function(group) {
          if ($scope.shownGroup === group && $scope.shownGroup.subevents) {
            return true;
          }
        };

        $scope.refreshFavorites = function() {
          $scope.favs = Array.from(Favorites.get());
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
        };

        // Display event info pop-up
        $scope.showAlert = function(event) {
          if (event.type == 'composite') 
            return;
          var alertPopup = $ionicPopup.alert({
            title: event.title,
            // factory set lat/lng
            content: "<a href=\"#/tab/map\" ng-click='location.setProperty("+ event.lat + "," + event.lng + ")'>" + event.location + "</a><br><br>" + event.description ,
            buttons: [{text: 'CLOSE',
              type: 'button-positive'}]
          });
        };
      }])

  /*
   * Navigation Controller - manages navigation bar date chooser
   */
  .controller('NavCtrl', function($scope, $rootScope, $ionicPopover, $ionicModal, Events) {

    Events.getDates(function(data) {
      $scope.dates = data;
    });

    // Select new date
    $scope.changeDate = function(date) {
      $scope.modal.hide();
      $rootScope.$broadcast('dateChanged', date);
    }

    // When event list is populated, get the date and display it's name
    $scope.$on('gotEvents', function(event) {
      $scope.currentDate = Events.getCurrDate();
    });


    if (ionic.Platform.isAndroid()) {
      $scope.animation = 'slide-in-right'; // Will disable Android animations (intentional)
>>>>>>> front_end
    } else {
      $scope.animation = 'am-slide-top';
    }
<<<<<<< HEAD
  }
  var alertPopup;
  // Display event info pop-up
  $scope.showAlert = function(event) {
       if (event.type == 'composite') 
         return;
       alertPopup = $ionicPopup.alert({
              title: event.title,
              scope: $scope,
              content: "<button class='locationButton' ng-click='goToMap(" + event.lat + "," + event.lng + ", \"" + event.location +  "\", \"" + event.address + "\")'>" + event.location + "</button><br><br>" + event.description 
      });
  }

  $scope.goToMap = function(lat, lng, building, address) {
      alertPopup.close();
      location.setProperty(lat, lng, building, true, address);
      $state.go("tab.map");
  }

}])

// Leftover from demo app - might revert to full screen event details page, so keeping it for now
.controller('EventDetailCtrl', function($scope, $stateParams, Events) {
  $scope.event = Events.getEvent($stateParams.eventId);
})

// Documents controller
.controller('DocumentsCtrl', ['$scope', '$state', '$ionicScrollDelegate', 'Documents',
             function($scope, $state, $ionicScrollDelegate, Documents)  {
  $scope.$on('$ionicView.enter', function() {
   Documents.get(function(docs) {
      $scope.docs = docs;
    });
  });
}]);
=======

    // Generate modal date chooser
    $ionicModal.fromTemplateUrl('templates/choose-date.html', {
      scope: $scope,
      animation: $scope.animation
    }).then(function(modal) {
      $scope.modal = modal;
    });
  })

// Leftover from demo app - might revert to full screen event details page, so keeping it for now
  .controller('EventDetailCtrl', function($scope, $stateParams, Events) {
    $scope.event = Events.getEvent($stateParams.eventId);
  })

// To become coupons page controller
  .controller('FavoritesCtrl', function($scope, Favorites) {
    $scope.$on('$ionicView.enter', function() {
      $scope.favs = Array.from(Favorites.get());
    });
  });
>>>>>>> front_end

