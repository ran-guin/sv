/**
* Result.js
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

    party : {
        model : 'party'
    },

    votes : {
        type : 'integer'
    }
  }
};

