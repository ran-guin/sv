'use strict';

var app = angular.module('myApp');

app.controller('PartyController', 
    ['$scope', '$http', '$q',
    function clinicController ($scope, $http, $q) {

    console.log('loaded user controller');        

    $scope.name = 'this name';

}]);
