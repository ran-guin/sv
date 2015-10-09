'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function($scope, elm, attrs) {
      elm.text(version);
    };
  }
])
  .directive('gChart', function () {
    return function ($scope, elm, attrs) {

      var elID = document.getElementById('chartdiv');
      var chart = new google.visualization.LineChart(elID);

        console.log("DRAW CHART TO " + elID);
      chart.draw($scope.chart.data, $scope.chart.options);
    };
  }); 
