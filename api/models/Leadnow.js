/**
* Leadnow.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    riding : {
        model : 'riding'
    },

    dataset : {
        model : 'dataset'
    },

    total_votes : {
        type: 'number'
    },

    winner : {
        model : 'party'
    },

    winning_counts : {
        type : 'integer'
    },

    second_place : {
        model : 'party'
    },

    second_place_count : {
        type : 'integer'
    },

    Conservative : {
        type : 'integer'
    },
    Liberal : {
        type : 'integer'
    },
    NDP : { 
        type : 'integer'
    },
    Green : {
        type : 'integer'
    },
    Other : {
        type: 'integer'
    },

    margin : {
        type : 'integer'
    },

    leadnow_green : {
        type : 'integer'
    },

    leadnow_liberal : {
        type : 'integer'
    },

    leadnow_ndp : {
        type : 'integer'
    },

    leadnow_other : {
        type : 'integer'
    },

    leadnow_undecided : {
        type : 'integer'
    },

  }
};

