angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('EventsCtrl', 
            ['$scope', '$ionicPopup', '$ionicScrollDelegate', 'Events', 'Favorites', 
             function($scope, $ionicPopup, $ionicScrollDelegate, Events, Favorites) {

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
       var alertPopup = $ionicPopup.alert({
              title: event.title,
              content: event.location + "<br><br>" + event.description 
      });
  }
}])

// Leftover from demo app - might revert to full screen event details page, so keeping it for now
.controller('ChatDetailCtrl', function($scope, $stateParams, Events) {
  // console.log($stateParams.eventId);
  $scope.event = Events.getEvent($stateParams.eventId);
  // console.log($scope.event);
})

// Third page controler - name leftover form demo app, currently favorites list
.controller('AccountCtrl', function($scope, Favorites) {
  $scope.$on('$ionicView.enter', function() {
    $scope.favs = Array.from(Favorites.get());
    console.log("GettingFavsList: ", $scope.favs);
  });
});

