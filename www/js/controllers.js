angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('EventsCtrl', 
            ['$scope', '$ionicPopup', '$ionicScrollDelegate', 'Events', 'Favorites', 
             function($scope, $ionicPopup, $ionicScrollDelegate, Events, Favorites) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  Events.get(function(data) {
      $scope.events = data;
      console.log('$scope.events: %o', $scope.events);    
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

  // On star click
  $scope.toggleFavorite = function(event, event_id) {
    html_id = "fav_icon_" + event_id;
    console.log(html_id);
    console.log(document);
    if (Favorites.has(event)) {
      // remove, unmark star
      document.getElementById(html_id).className = "icon ion-android-star-outline icon-accessory";
      Favorites.remove(event);
    } else {
      // add, mark star
      document.getElementById(html_id).className = "icon ion-android-star icon-accessory";
      Favorites.add(event);
    }

    console.log("FAVING: ", event);
    console.log(Favorites.get());
    // console.log(Favorites.favorites);
    // console.log(favs);
  }

  // Display event info pop-up
  $scope.showAlert = function(event) {
    // $ionicScrollDelegate.$getByHandle(event.id.toString()).scrollTop(); __NOT WORKING__
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
  console.log($stateParams.eventId);
  $scope.event = Events.getEvent($stateParams.eventId);
  console.log($scope.event);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
