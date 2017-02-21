angular.module('starter.controllers', ['ngCordova'])

/*
 * Map Controller
 */
 .controller('MapCtrl', function($scope, $state, location, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  var latLng = new google.maps.LatLng(42.4075, -71.1190);

  var posOptions = {
    enableHighAccuracy: false,
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
    console.log("GotPosition");
    var userlat  = position.coords.latitude;
    var userlong = position.coords.longitude;
    console.log("Position: ", userlat, ", ", userlong);

    userLatLng = new google.maps.LatLng(userlat, userlong);

    $scope.makeUserMarker(userLatLng);
    google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
    });    
  }, function(err) {
    console.log(JSON.stringify(err));
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

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent("<div class='bubble_content'><strong>"+loc.building+"</strong></br>" + loc.address + "</div>");
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


/*
 * Events Controller
 */
 .controller('EventsCtrl',
  ['$scope', '$rootScope', '$state', '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$ionicPosition', 'Events', 'Favorites', 'location', 
  function($scope, $rootScope, $state, $ionicPopup, $ionicScrollDelegate,  $timeout, $ionicPosition, Events, Favorites, location) {

  // Find the date to fetch if no date has been selected yet
  var dateID = Events.getCurrDateID();
  $scope.date = null;
  if (dateID == null) {
    var dates = Events.getDates();
    $scope.date = dates[0];
    dateID = $scope.date.event_id;
  } else {
    $scope.date = Events.getCurrDate();
  }

  // Broadcast gotEvents to rootScope when event list populated
  Events.get($scope.date, function(data) {
    $scope.events = data;
    $rootScope.$broadcast('gotEvents');
  });

  // Receive dateChanged event, repopulate event list
  // Broadcast gotEvents to rootScope when event list populated
  $scope.$on('dateChanged', function(event, date) {
    console.log("felt the click");
    Events.get(date, function(data) {
      $scope.events = data;
      $rootScope.$broadcast('gotEvents');
    });
  });

  // On expandable item click - scroll list item to top
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
      // Delay to allow expanding animation to finish
      // Ideally they would happen at the same time but it gets buggy and the scroll doesnt work
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

  // On favorites tab bar clicked
  $scope.refreshFavorites = function() {
    $scope.favs = Array.from(Favorites.get());
  };

  // On star click - change in data and html
  $scope.toggleFavorite = function(event, event_id) {
    html_id = "fav_icon_" + event_id;
    if (Favorites.has(event)) {
      // Could replace with jQuery
      document.getElementById(html_id).className = "icon ion-android-star-outline icon-accessory star";
      Favorites.remove(event);
    } else {
      document.getElementById(html_id).className = "icon ion-android-star icon-accessory star";
      Favorites.add(event);
    }
  };

  // Display event info pop-up
  var alertPopup;
  $scope.showAlert = function(event) {
    if (event.type == 'composite') 
      return;
    alertPopup = $ionicPopup.alert({
      title: event.title,
      buttons: [{text: 'Close'}],
      scope: $scope,
      content: "<button class='locationButton' ng-click='goToMap(" + event.lat + "," + event.lng + ", \"" + event.location +  "\", \"" + event.address + "\")'>" + event.location + "</button><br><br>" + event.description 
    });
  }

  // On click pop-up window location link
  $scope.goToMap = function(lat, lng, building, address) {
    alertPopup.close();
    location.setProperty(lat, lng, building, true, address);
    $state.go("tab.map");
  }
}])

/*
 * Navigation Controller - manages navigation bar date chooser
 */
 .controller('NavCtrl', function($scope, $rootScope, $ionicPopover, $ionicModal, Events) {

  Events.getDates(function(data) {
    $scope.dates = data;
  });

  // Select new date
  // Broadcast dateChanged event to rootScope
  $scope.changeDate = function(date) {
    $scope.modal.hide();
    $rootScope.$broadcast('dateChanged', date);
  }

  $scope.$on('gotEvents', function(event) {
    $scope.currentDate = Events.getCurrDate();
  });

  if (ionic.Platform.isAndroid()) {
    // Will disable Android animations (intentional) - slide-in-right is not implemented for modals
    // slide-top animation stutters on android right now
    // Might have to write custom css animation instead of using AngularUI
    $scope.animation = 'slide-in-right'; 
  } else {
    $scope.animation = 'am-slide-top';
  }

  // Generate modal date chooser
  $ionicModal.fromTemplateUrl('templates/choose-date.html', {
    scope: $scope,
    animation: $scope.animation
  }).then(function(modal) {
    $scope.modal = modal;
  });
})


/*
 * Documents Controller
 */
.controller('DocumentsCtrl', ['$scope', '$state', '$ionicScrollDelegate', 'Documents',
  function($scope, $state, $ionicScrollDelegate, Documents)  {
    $scope.$on('$ionicView.enter', function() {
      Documents.get(function(docs) {
        $scope.docs = docs;
      });
    });
  }]);
