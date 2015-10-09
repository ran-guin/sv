/**
 * LeadnowController
 *
 * @description :: Server-side logic for managing leadnows
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    home : function (req, res) {

        var ridings = req.param('ridings');

        var dataset = 1;
        var condition = { 'dataset' : 1 };

        if (ridings) { 
            var list = ridings.split(',');
            condition['riding'] = list;
        }

        Leadnow.find( condition ).populate('dataset').populate('riding').populate('winner').populate('second_place')
        .then ( function (results) {
            var Data = {};
            console.log("results: " + JSON.stringify(results));

            res.render('homepage', { data: JSON.stringify(results) } );
        });
    }                    

};

