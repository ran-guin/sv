/**
 * ResultController
 *
 * @description :: Server-side logic for managing results
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Q = require('q');

module.exports = {

    home : function (req, res) {

        var dataset = 1;

        Riding.find( {'province' : 'BC'})
        .then ( function (ridings) {
            var Data = {};
            console.log("ridings: " + JSON.stringify(ridings));

            var promises = [];
            var list = [];
            var leadnow = [];

            for (var i=0; i<ridings.length; i++) {
                var riding_id = ridings[i].id;
                promises.push(Result.find( {'riding' : riding_id}).populate('party').populate('dataset')); 
                list.push(ridings[i].name);
                leadnow.push(ridings[i].leadnow);
            }
       
            console.log("Loaded ridings .." + promises.length);

            Q.allSettled(promises)
            .then ( function (results) {
                console.log("results finished...");
                console.log("LEADNOW: " + JSON.stringify(leadnow));
                    console.log(results.length + ' result datasets');
                    
                    var Seats = {};
                    for (var j=0; j<results.length; j++) {
                        var riding = list[j];
                        var result = results[j].value;
                        console.log(j + ": " + riding + ' -> ' + JSON.stringify(result)) 

                        console.log(riding + " : " + result.length + ' datapoints');
                        
                        Data[riding] = {};
                        Data[riding]['votes'] = [];

                        var max = 0;
                        var winner = '';
                        var help = '';
                        var maxHelp = 0;
                        for (var k=0; k< result.length; k++) {
                            console.log(JSON.stringify(result[k]));
                            console.log(JSON.stringify(leadnow[j]));

                            var row = [];
                            row.push(result[k].party.name);
                            row.push(result[k].votes);
                            
                            if (result[k].votes > max) { 
                                max = result[k].votes;
                                winner = result[k].party.name;
                            }
                            if (result[k].votes > maxHelp && result[k].party.name != 'C') {
                                // find top NON Conservative party 
                                help=result[k].party.name;
                                maxHelp = result[k].votes;
                            }

                            Data[riding]['votes'].push(row);
                        }

                        Data[riding]['help'] = help;    // keep track of top party of choice 
                        Data[riding]['threshold'] = max;
                        Data[riding]['leadnow'] = leadnow[j];
                        Data[riding]['winner'] = winner;
                    
                        if ( Seats[winner]) { Seats[winner]++ }
                        else { Seats[winner] = 1 }

                        console.log(riding + " Data: " + JSON.stringify(Data[riding]));
                    }
                    
                    Data['seats'] = Seats;

                    res.render('homepage', { data: JSON.stringify(Data) } );
            });
        });
    }                    

};

