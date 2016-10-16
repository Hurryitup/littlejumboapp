angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('EventsCtrl', ['$scope', 'Events', function($scope, Events) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Events.getPromise().success(function(response) {
  //   $scope.events = response;
  // }).then(function (data) {
  //   Events.store(data);
  // });
  Events.get(function(data) {
      $scope.events = data;
      console.log('$scope.events: %o', $scope.events);    
  });
  $scope.groups = [];
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
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

  $scope.showAlert = function() {
       var alertPopup = $ionicPopup.alert({
              title: 'Don\'t eat that!',
                   template: 'It might taste good'
      });
  }
}])

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
