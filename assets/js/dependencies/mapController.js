'use strict';

/* Controllers */
google.load('visualization', '1', {
  packages: ['corechart']
});

google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['myApp']);
});

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', '$q',

    function ($scope, $q) {

        console.log("load map Controller..");

        $scope.chart = {};  // stored charts
        $scope.Data = {};   // stored datasets 
        $scope.name = 'Temp Name';
        $scope.title = "Strategic Voting";

        $scope.abiders = 90;
        $scope.addons  = 100;

        $scope.parties = ['NDP','Liberal','Green','Conservative','Other'];  // needs to match party name... 
   
        $scope.redraw = function(name, options) {
            console.log('Redraw: ' + name);

            var chart;
            if ($scope.chart[name] == 'undefined') {
                chart = $scope.chart[name];
                console.log("Retrieved " + name + " chart " + JSON.stringify(chart));
            }
            else {
                chart = {};

                // default settings 
                chart.element = 'chart_div';
                chart.type = 'ColumnChart';
                chart.options = options || {
                        'filterColumnLabel' : 'Abiding',
                        'isStacked' : 'false',
                        'colors' : ['orange','red','green','blue','grey'],
                };

                chart.data = $scope.parseData(name);

                console.log("Built " + name + " chart " + JSON.stringify(chart));
            }

            $scope.chart[name] = chart;
            
            var data = google.visualization.arrayToDataTable(chart.data);

            var type = chart.type || 'ColumnChart';
            
            var canvas = new google.visualization[type](document.getElementById(chart.element));
            canvas.draw(data, chart.options);
        },

    $scope.redrawSummary = function (name, data) {
        var Vdata = google.visualization.arrayToDataTable(data);
        var type = 'PieChart';
        var options = {
            colors: ['#FDA','#C63','orange', '#AFA','#9C9','green', '#FAA', '#A66', 'red', '#99A', '#AAF', 'blue']
        };
        
        var element = document.getElementById(name);
        console.log(name +' redraw ' + element);

        var canvas2 = new google.visualization[type](element);
        console.log('draw:' + JSON.stringify(data));
        canvas2.draw(Vdata, options);

        google.visualization.events.addListener(canvas2, 'select', 
            function selectHandler (err) {
                var selection = canvas2.getSelection();
                var row = selection[0].row;
                var scope = $scope.scope[row];
                console.log(row + ': ' + JSON.stringify(selection));
                console.log("Scope = " + scope);
                var ridings = $scope[scope].join(',');
                $scope.message="Ridings: " + ridings;
                var url = "/sv?ridings=" + ridings;
//                alert(ridings);
                window.open(url,'_self','height=200,width=150');
            });
    },

    $scope.drawRidings = function () {
        var ridings = Object.keys($scope.Riding);
        $scope.ridings = ridings;
        
        console.log("Found " + ridings.length + ridings);

        var type = 'BarChart';
        var options = {
            'colors' : ['orange','red','green','blue','grey'],
            'height': ridings.length * 100,
            'fontSize': 14,
            'legend' : { position: 'none' },
        };

        var SVoptions = {
            'colors' : ['orange','red','green','blue','grey'],
            'height': ridings.length * 100,
            'fontSize': 14,
            'legend' : { textStyle : { fontSize: 14} },
        };
        
        console.log("Ridings: " + ridings.join(', '));
        
        var Rchart = {};

        var labels = ['Riding'];
        for (i=0; i< $scope.parties.length; i++) {
            labels.push($scope.parties[i]);
        }
        console.log("LABELS " + JSON.stringify(labels));

        var RidingData = [ labels ];
        var RidingSVData = [ labels ];

        for (var i=0; i<ridings.length; i++) {
            var riding = ridings[i];
            RidingData.push($scope.Riding[riding].data);
            RidingSVData.push($scope.Riding[riding].SVdata);
        }

        console.log("Riding Data: " + JSON.stringify(RidingData));

        var element = document.getElementById('Riding_chart');
        var SVelement = document.getElementById('Riding_SVchart');

        var RidingGD = google.visualization.arrayToDataTable(RidingData);
        var RidingSVGD = google.visualization.arrayToDataTable(RidingSVData);

        var RidingChart = new google.visualization[type](element);
        var RidingSVChart = new google.visualization[type](SVelement);

        console.log("Riding chart options: " + JSON.stringify(options));
        RidingChart.draw(RidingGD, options);
        RidingSVChart.draw(RidingSVGD, SVoptions);

    },

    $scope.loadData = function (name, data) {
   
        $scope.Data[name] = data;
        console.log("loaded " + name + " data");
    },

    $scope.get_boost = function (data, party) {
        
        var boost_total = 0;
        boost_total = (data.leadnow_green + data.leadnow_ndp + data.leadnow_liberal + data.leadnow_other + data.leadnow_undecided);
        boost_total = boost_total + parseInt($scope.addons);
        boost_total  = boost_total * parseInt($scope.abiders) / 100;

        return boost_total; 
    },
    
    $scope.parseData = function (name) {
        var factor = $scope.factor;

        var data = $scope.Data[name];

        var newData = ['Party', 'Seats', 'Again', { role : 'style'}];
        
        var parties = $scope.parties;
        var block = 'Conservative';

        var Seats = {};
        var SV = {};

        var Possible = [];
        var Potential = [];
        var Losing = [];

        var Riding = {};

        for (var i=0; i<parties.length; i++) {
            Seats[parties[i]] = [];
            SV[parties[i]] = [];
            $scope['Tight_' + parties[i]] = [];
            $scope['Gained_' + parties[i]] = [];
            $scope['Solid_' + parties[i]] = [];
            $scope['TwoPartyRace_' + parties[i]] = [];
        }

        for (var i=0; i<data.length; i++) {
            var riding = data[i].riding.name;
            var riding_id = data[i].riding.id;
            var winner = data[i].winner.name;
            var second_place = data[i].second_place.name;
            var second_place_count = data[i].second_place_count;
            var total_votes = data[i].total_votes;
           
            if (Seats[winner] == undefined) { winner = 'Other' }
            if (SV[second_place] == undefined) { second_place = 'Other' }

            var count = data[i].winning_counts;
            var margin = data[i].margin;
            if (winner != block && second_place != block) {
                // adjust margin to represent margin to blocked party 
                margin = count - data[i][block];
            }

        
            var boost = $scope.get_boost(data[i],second_place);
            if (boost > margin && winner == block) {
                $scope['Gained_' + second_place].push(riding_id);                
                SV[second_place].push(riding_id);
            }
            else if (boost > margin && winner != block) {
                $scope['Tight_' + winner].push(riding_id); 
                SV[winner].push(riding_id);
            }
            else if (winner == block && boost > margin/2) {
                Potential.push(riding_id);
                SV[winner].push(riding_id);
            }
            else if (winner == block && (margin < count*0.4) ) {
                Possible.push(riding_id);
                SV[winner].push(riding_id);
            }
            else if (winner == block) {
                Losing.push(riding_id);
                SV[winner].push(riding_id);
            }
            else if (winner != block) {
                $scope['Solid_' + winner].push(riding_id);
                SV[winner].push(riding_id);
            }

            Riding[riding] = {};
            var Rdata = [riding];
            var SVdata = [riding];
            for (var j=0; j<parties.length; j++) {
                var field = parties[j];
                Rdata.push(data[i][field]);
                
                var adjusted = data[i][field];
                if (winner == block && field == second_place) { adjusted = data[i][field] + boost }
                if (winner != block && field == winner) { adjusted = data[i][field] + boost }
                SVdata.push(adjusted);
            }
            Riding[riding].data = Rdata;
            Riding[riding].SVdata = SVdata;

            console.log("Riding Results: " + JSON.stringify(Riding[riding].data));
            console.log("SV Results: " + JSON.stringify(Riding[riding].SVdata));

            Seats[winner].push(riding);
            console.log(riding + ' won by ' + winner + ' by ' +  margin + ' with ' + boost + ' boosted votes');

            if ( (count < total_votes*0.45) && ( count + second_place_count > 0.75*total_votes ) ) {
                if (winner == block) {
                    $scope['TwoPartyRace_' + second_place].push(riding_id);
                }
                else if (second_place == block && margin < 0.1*count ) {
                    $scope['TwoPartyRace_' + winner].push(riding_id);
                }
            } 
            console.log(riding + " : " + count + " + " + second_place_count + " vs " + total_votes*0.75 + " of " + total_votes );
        }
       
        $scope.Riding = Riding;

        $scope.message = data.length + " Riding Results";
        
        $scope.Seats = Seats;
        $scope.SV    = SV;

        $scope.Possible = Possible;
        $scope.Potential = Potential;
        $scope.Losing = Losing;

        console.log("Seats: " + JSON.stringify(Seats));

        $scope.scope = ['Winning','Losing','Gained_NDP','Gained_Liberal', 'Closing', 'Plan B','Tight_NDP','Tight_Liberal'];

        var summaryData = [
            ['Status','Seats'],
            
            ['Gained_NDP', $scope.Gained_NDP.length],
            ['Tight_NDP', $scope.Tight_NDP.length],
            ['Solid_NDP', $scope.Solid_NDP.length],

            ['Gained_Green', $scope.Gained_Green.length],
            ['Tight_Green', $scope.Tight_Green.length],
            ['Solid_Green', $scope.Solid_Green.length],

            ['Gained_Liberal', $scope.Gained_Liberal.length],
            ['Tight_Liberal', $scope.Tight_Liberal.length],
            ['Solid_Liberal', $scope.Solid_Liberal.length],

            ['Potential', $scope.Potential.length],
            ['Possible', $scope.Possible.length],
            ['Losing',$scope.Losing.length],
       ];

       for (var i=0; i< summaryData.length; i++) {
            var check = summaryData[i][0];
            console.log( check + " Summary: " + JSON.stringify( $scope[check]) );
       }

       $scope.TwoPartyRaces = $scope['TwoPartyRace_Liberal'].join(',')
        console.log("TWO PARTY RACES: " + JSON.stringify( $scope['TwoPartyRace_Liberal'] ) );
        console.log("TWO PARTY RACES: " + JSON.stringify($scope.TwoPartyRace_Liberal));

        $scope.redrawSummary('summary_chart', summaryData);
       
        var titles = ['Seats'];
        var noSV  = ['Past Results'];
        var withSV = ['Effect of Strategic Voting'];

        var TwoPartyRaces = [];
        for (var i=0; i<parties.length; i++) {
            titles.push(parties[i]);
            noSV.push(Seats[parties[i]].length);
            withSV.push(SV[parties[i]].length);
            if ($scope['TwoPartyRace_' + parties[i]].length) { 
                TwoPartyRaces.push($scope['TwoPartyRace_' + parties[i]]);

            }
        }
        $scope.TwoPartyRaces = TwoPartyRaces.join(',');

        var TPR = '';
        for (var i=0; i<TwoPartyRaces.length; i++) {
            TPR += "<LI><A Href='/sv?ridings=" +  TwoPartyRaces[i] + "'></A></LI>";
        }
        $scope.TPR = TPR;

        var newData = [ titles];
        newData.push(noSV);
        newData.push(withSV);
            
        console.log("new data: " + newData);
        return newData;
    },

    $scope.setup = function (data) {
     
      console.log("setup...");
      $scope.name = "Local Name";

      $q.when( $scope.loadData('original', data) )
      .then ( function (response) { 
            $scope.redraw('original');
            $scope.drawRidings();
      });

    }

  }
])
  .controller('MyCtrl2', ['$scope', '$q',

    function ($scope, $q) {
        $scope.name = 'TEST 2';
    }
]);
