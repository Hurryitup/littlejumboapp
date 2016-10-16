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

  Events.getPromise().success(function(response) {
    $scope.events = response;
  }).then(function (data) {
    Events.store(data);
  });


  Events.store($scope.events);
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Events) {
  $scope.events = Events.events;
  console.log("CHDC");
  console.log($scope.events);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
