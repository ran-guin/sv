# maptest

a [Sails](http://sailsjs.org) application

add link to google.com/jsapi (in header)

add angular.js to dependencies

add mapController

define myApp in app.js

<div ng-controller="MyCtrl1" id="chartdiv"></div> in homepage file


### database update

delete from leadnow where dataset = <DATASET>

 insert into leadnow (riding, total_votes, winning_counts, dataset) select riding, sum(votes), max(votes), dataset from result WHERE result.dataset = <DATASET> group by riding, dataset;

update leadnow, result set winner = party where result.dataset=leadnow.dataset and result.riding = leadnow.riding and result.votes = winning_counts AND result.dataset = <DATASET>;

update leadnow set second_place_count = 0;

update  leadnow, result set second_place = party, second_place_count = votes where result.dataset = leadnow.dataset and result.riding=leadnow.riding and votes > second_place_count and votes < winning_counts AND result.dataset = <DATASET>;
update  leadnow, result set second_place = party, second_place_count = votes where result.dataset = leadnow.dataset and result.riding=leadnow.riding and votes > second_place_count and votes < winning_counts AND result.dataset = <DATASET>;
update leadnow set margin = winning_counts - second_place_count;

update leadnow, result set Conservative = votes where leadnow.riding=result.riding and leadnow.dataset=result.dataset and result.party = 1;
update leadnow, result set NDP = votes where leadnow.riding=result.riding and leadnow.dataset=result.dataset and result.party = 2;
update leadnow, result set Liberal = votes where leadnow.riding=result.riding and leadnow.dataset=result.dataset and result.party = 3;
update leadnow, result set Green = votes where leadnow.riding=result.riding and leadnow.dataset=result.dataset and result.party = 4;
update leadnow, result set Other = total_votes-Conservative-NDP-Liberal-Green;

update leadnow set leadnow_green = Green*0.1, leadnow_liberal = Liberal*0.1, leadnow_ndp=NDP*0.1, leadnow_other=Other*0.1, leadnow_undecided=(total_votes-Conservative)*0.1;  ## ESTIMATE ONLY IF NUMBERS NOT AVAILABLE
  
