/**
* Riding.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name : {
        type: 'string',
    },

    province : {
        type: 'string', 
        enum: ['BC','Alberta','Saskatchewan','Manitoba','Ontario','Quebec','New Brunswick','Nova Scotia','PEI','Newfoundland','Yukon','NWT','Nunavut']
    },

  }
};

